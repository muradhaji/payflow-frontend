import type {
  InstallmentCreate,
  MonthlyPaymentCreate,
} from '../../../types/installment';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePickerInput } from '@mantine/dates';
import { Loader, LoadingOverlay, NumberInput, TextInput } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addInstallment } from '../../../features/installments/installmentsSlice';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { sumByKeyDecimal } from '../../../utils/math';
import * as yup from 'yup';
import dayjs from 'dayjs';

const AddInstallment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    addInstallment: { loading },
  } = useAppSelector((state) => state.installments);
  const { t, i18n } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object({
        title: yup
          .string()
          .required(t('installments.add.errors.form.nameRequired')),
        amount: yup
          .number()
          .positive(t('installments.add.errors.form.amountPositive'))
          .required(t('installments.add.errors.form.amountRequired'))
          .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          }),
        startDate: yup
          .string()
          .required(t('installments.add.errors.form.startDateRequired'))
          .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            t('installments.add.errors.form.startDateFormat')
          ),
        monthCount: yup
          .number()
          .min(1, t('installments.add.errors.form.monthCountMin'))
          .required(t('installments.add.errors.form.monthCountRequired'))
          .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          }),
        monthlyPayments: yup
          .array()
          .of(
            yup.object({
              date: yup
                .string()
                .required(
                  t('installments.add.errors.form.monthlyPaymentDateRequired')
                ),
              amount: yup
                .number()
                .positive(
                  t('installments.add.errors.form.monthlyPaymentAmountPositive')
                )
                .required(
                  t('installments.add.errors.form.monthlyPaymentAmountRequired')
                )
                .transform((value, originalValue) => {
                  return originalValue === '' ? undefined : value;
                }),
            })
          )
          .default([])
          .test('sum-mismatch', function (monthlyPayments) {
            const { amount } = this.parent;
            if (!monthlyPayments || !amount) return true;

            const sum = sumByKeyDecimal(monthlyPayments, 'amount');

            const errorMessage = t('installments.add.errors.form.sumMismatch', {
              sum: sum.toFixed(2),
              amount: amount.toFixed(2),
            });

            return (
              sum.toFixed(2) === amount.toFixed(2) ||
              this.createError({ message: errorMessage })
            );
          }),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<InstallmentCreate>({
    defaultValues: {
      startDate: dayjs().add(1, 'month').startOf('month').format('YYYY-MM-DD'),
      monthCount: 1,
      monthlyPayments: [],
    },
    resolver: yupResolver(schema),
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'monthlyPayments',
  });

  const amount = watch('amount');
  const monthCount = watch('monthCount');
  const startDate = watch('startDate');

  useEffect(() => {
    const handleLanguageChange = () => {
      reset(watch());
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged');
    };
  }, [i18n, reset, watch]);

  useEffect(() => {
    if (amount > 0 && monthCount > 0 && startDate) {
      const base = dayjs(startDate, 'YYYY-MM-DD');
      const payments: MonthlyPaymentCreate[] = [];
      const baseAmount = Math.floor((amount * 100) / monthCount) / 100;
      const remaining = +(amount - baseAmount * monthCount).toFixed(2);

      for (let i = 0; i < monthCount; i++) {
        const date = base.add(i, 'month').format('YYYY-MM-DD');
        let amount = baseAmount;

        if (i === monthCount - 1) {
          amount = +(amount + remaining).toFixed(2);
        }

        payments.push({ date, amount: +amount.toFixed(2) });
      }

      replace(payments);
    }
  }, [amount, monthCount, startDate, replace]);

  const onSubmit = async (data: InstallmentCreate): Promise<void> => {
    try {
      const resultAction = await dispatch(addInstallment(data));

      if (addInstallment.fulfilled.match(resultAction)) {
        showNotification({
          title: t('installments.add.notifications.successTitle'),
          message: t('installments.add.notifications.successMessage'),
          color: 'green',
          icon: <Check />,
        });
        navigate(`/payments/details/${resultAction.payload._id}`);
      } else {
        showNotification({
          title: t('installments.add.notifications.errorTitle'),
          message: t('installments.add.notifications.errorMessage'),
          color: 'red',
          icon: <X />,
        });
        console.error(resultAction.payload);
      }
    } catch (error) {
      showNotification({
        title: t('installments.add.notifications.errorTitle'),
        message: t('installments.add.notifications.errorMessage'),
        color: 'red',
        icon: <X />,
      });
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <Link
          to='/dashboard'
          className='bg-gray-600 text-white px-3 py-1 rounded-xl hover:bg-gray-500 transition flex gap-2'
        >
          <ArrowLeft />
        </Link>
        <button
          type='submit'
          form='add-payment-form'
          className='flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500'
        >
          {t('installments.add.buttons.addInstallment')}
        </button>
      </div>

      <div className='relative w-full max-w-5xl mx-auto'>
        <LoadingOverlay
          visible={loading}
          loaderProps={{ children: <Loader size='sm' type='dots' /> }}
          className='rounded-md'
        />

        <form
          id='add-payment-form'
          onSubmit={handleSubmit(onSubmit)}
          className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-md shadow'
        >
          <div className='flex flex-col gap-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-md font-medium text-gray-700 mb-1'
              >
                {t('installments.add.form.fields.name.label')}
              </label>
              <TextInput
                id='name'
                placeholder={t('installments.add.form.fields.name.placeholder')}
                {...register('title')}
                size='md'
              />
              {errors.title && (
                <p className='text-red-500 text-sm'>{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='totalAmount'
                className='block text-md font-medium text-gray-700 mb-1'
              >
                {t('installments.add.form.fields.amount.label')}
              </label>

              <Controller
                control={control}
                name='amount'
                render={({ field }) => (
                  <NumberInput
                    id='totalAmount'
                    placeholder={t(
                      'installments.add.form.fields.amount.placeholder'
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    allowDecimal
                    decimalScale={2}
                    allowNegative={false}
                    suffix=' ₼'
                    error={errors.amount?.message}
                    hideControls
                    thousandSeparator=','
                    size='md'
                  />
                )}
              />
            </div>

            <div>
              <label
                htmlFor='startDate'
                className='block text-md font-medium text-gray-700 mb-1'
              >
                {t('installments.add.form.fields.startDate.label')}
              </label>
              <Controller
                control={control}
                name='startDate'
                render={({ field }) => (
                  <DatePickerInput
                    value={
                      field.value
                        ? dayjs(field.value, 'YYYY-MM-DD').toDate()
                        : null
                    }
                    onChange={(date) =>
                      field.onChange(
                        date ? dayjs(date).format('YYYY-MM-DD') : ''
                      )
                    }
                    valueFormat='DD-MM-YYYY'
                    placeholder={t(
                      'installments.add.form.fields.startDate.placeholder'
                    )}
                    id='startDate'
                    size='md'
                  />
                )}
              />

              {errors.startDate && (
                <p className='text-red-500 text-sm'>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='monthCount'
                className='block text-md font-medium text-gray-700 mb-1'
              >
                {t('installments.add.form.fields.monthCount.label')}
              </label>
              <Controller
                control={control}
                name='monthCount'
                render={({ field }) => (
                  <NumberInput
                    id='monthCount'
                    placeholder={t(
                      'installments.add.form.fields.monthCount.placeholder'
                    )}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hideControls
                    error={errors.monthCount?.message}
                    allowNegative={false}
                    allowDecimal={false}
                    size='md'
                  />
                )}
              />
            </div>
          </div>

          <div>
            {fields.length > 0 ? (
              <div className='bg-gray-100 p-4 rounded-md'>
                <p className='font-semibold mb-2'>
                  {t(
                    'installments.add.form.fields.monthlyPayments.commonLabel'
                  )}
                </p>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2 mb-2'>
                    <Controller
                      control={control}
                      name={`monthlyPayments.${index}.date`}
                      render={({ field }) => (
                        <DatePickerInput
                          placeholder={t(
                            'installments.add.form.fields.monthlyPayments.date.placeholder'
                          )}
                          value={
                            field.value
                              ? dayjs(field.value, 'YYYY-MM-DD').toDate()
                              : null
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? dayjs(date).format('YYYY-MM-DD') : ''
                            )
                          }
                          minDate={dayjs(field.value).startOf('month').toDate()}
                          maxDate={dayjs(field.value).endOf('month').toDate()}
                          valueFormat='DD-MM-YYYY'
                          error={errors.startDate?.message}
                          className='whitespace-nowrap'
                          size='md'
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`monthlyPayments.${index}.amount`}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t(
                            'installments.add.form.fields.monthlyPayments.amount.placeholder'
                          )}
                          suffix=' ₼'
                          allowDecimal
                          decimalScale={2}
                          thousandSeparator=','
                          allowNegative={false}
                          hideControls
                          className='grow'
                          size='md'
                          error={
                            errors.monthlyPayments?.[index]?.amount?.message
                          }
                        />
                      )}
                    />
                  </div>
                ))}
                {errors?.monthlyPayments?.root?.message && (
                  <p className='text-red-500 text-sm'>
                    {errors?.monthlyPayments?.root?.message}
                  </p>
                )}
              </div>
            ) : (
              <p className='text-gray-500 text-sm italic text-center'>
                {t('installments.add.form.fields.monthlyPayments.empty.title')}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstallment;
