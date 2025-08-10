import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import { useParams, useNavigate } from 'react-router-dom';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  TextInput,
  NumberInput,
  Loader,
  LoadingOverlay,
  Button,
} from '@mantine/core';

import { DatePickerInput } from '@mantine/dates';
import { IconCalendarClock, IconCheck, IconX } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';

import { sumByKeyDecimal } from '../../../utils/math';
import utilStyles from '../../../styles/utils.module.css';

import type {
  InstallmentEdit,
  MonthlyPaymentEdit,
} from '../../../types/installment';

import {
  getInstallmentById,
  updateInstallment,
  clearSelectedInstallment,
} from '../../../features/installments/installmentsSlice';

import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';

const EditInstallment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    selectedInstallment,
    getInstallmentById: { loading: getInstallmentByIdLoading },
    updateInstallment: { loading: updateInstallmentLoading },
  } = useAppSelector((state) => state.installments);

  const schema = useMemo(
    () =>
      yup.object({
        title: yup
          .string()
          .required(t('forms.installment.errors.form.nameRequired')),
        amount: yup
          .number()
          .positive(t('forms.installment.errors.form.amountPositive'))
          .required(t('forms.installment.errors.form.amountRequired'))
          .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          }),
        startDate: yup
          .string()
          .required(t('forms.installment.errors.form.startDateRequired'))
          .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            t('forms.installment.errors.form.startDateFormat')
          ),
        monthCount: yup
          .number()
          .required(t('forms.installment.errors.form.monthCountRequired'))
          .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          })
          .test('month-count-min', function (value) {
            const { monthlyPayments } = this.parent;
            const paidCount =
              monthlyPayments?.filter((p: MonthlyPaymentEdit) => p.paid)
                .length || 0;

            const errorMessage = t(
              'forms.installment.errors.form.monthCountMin',
              {
                paidCount,
              }
            );

            return (
              value >= paidCount || this.createError({ message: errorMessage })
            );
          }),
        monthlyPayments: yup
          .array()
          .of(
            yup.object({
              date: yup
                .string()
                .required(
                  t('forms.installment.errors.form.monthlyPaymentDateRequired')
                ),
              amount: yup
                .number()
                .positive(
                  t(
                    'forms.installment.errors.form.monthlyPaymentAmountPositive'
                  )
                )
                .required(
                  t(
                    'forms.installment.errors.form.monthlyPaymentAmountRequired'
                  )
                )
                .transform((value, originalValue) => {
                  return originalValue === '' ? undefined : value;
                }),
              paid: yup.boolean().default(false),
            })
          )
          .default([])
          .test('sum-missmatch', function (monthlyPayments) {
            const { amount } = this.parent;
            if (!monthlyPayments || !amount) return true;

            const sum = sumByKeyDecimal(monthlyPayments, 'amount');

            const errorMessage = t(
              'forms.installment.errors.form.sumMismatch',
              {
                sum: sum.toFixed(2),
                amount: amount.toFixed(2),
              }
            );

            return (
              sum.toFixed(2) === amount.toFixed(2) ||
              this.createError({ message: errorMessage })
            );
          }),
      }),
    [t]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<InstallmentEdit>({
    resolver: yupResolver(schema),
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'monthlyPayments',
  });

  const amount = watch('amount');
  const monthCount = watch('monthCount');
  const startDate = watch('startDate');
  const monthlyPayments = watch('monthlyPayments');

  useEffect(() => {
    if (!id) {
      navigate('/payments');
      return;
    }

    dispatch(getInstallmentById(id));

    return () => {
      dispatch(clearSelectedInstallment());
    };
  }, [id, navigate, dispatch]);

  useEffect(() => {
    if (selectedInstallment) {
      reset({
        title: selectedInstallment.title,
        amount: selectedInstallment.amount,
        startDate: dayjs(selectedInstallment.startDate).format('YYYY-MM-DD'),
        monthCount: selectedInstallment.monthCount,
        monthlyPayments: selectedInstallment.monthlyPayments.map((p) => {
          return { ...p, date: dayjs(p.date).format('YYYY-MM-DD') };
        }),
      });
      replace(
        selectedInstallment.monthlyPayments.map((p) => {
          return { ...p, date: dayjs(p.date).format('YYYY-MM-DD') };
        })
      );
    }
  }, [selectedInstallment, reset, replace]);

  useEffect(() => {
    if (amount > 0 && monthCount > 0 && startDate) {
      const paidPayments = monthlyPayments.filter((p) => p.paid);
      const newMonthCount = monthCount - paidPayments.length;
      const remainingAmount = +(
        amount - sumByKeyDecimal(paidPayments, 'amount')
      ).toFixed(2);

      const base = dayjs(startDate, 'YYYY-MM-DD').add(
        paidPayments.length,
        'month'
      );

      const payments: MonthlyPaymentEdit[] = [];
      const baseAmount =
        Math.floor((remainingAmount * 100) / newMonthCount) / 100;
      const remaining = +(remainingAmount - baseAmount * newMonthCount).toFixed(
        2
      );

      for (let i = 0; i < newMonthCount; i++) {
        const date = base.add(i, 'month').format('YYYY-MM-DD');
        let amount = baseAmount;

        if (i === newMonthCount - 1) {
          amount = +(amount + remaining).toFixed(2);
        }

        payments.push({ date, amount: +amount.toFixed(2), paid: false });
      }

      if (
        JSON.stringify([...paidPayments, ...payments]) !==
        JSON.stringify(monthlyPayments)
      ) {
        replace([...paidPayments, ...payments]);
      }
    }
  }, [amount, monthCount, startDate, monthlyPayments, replace]);

  useEffect(() => {
    trigger('monthlyPayments');
  }, [amount, monthCount, trigger]);

  const onSubmit = async (newData: InstallmentEdit): Promise<void> => {
    if (!id) {
      return;
    }

    try {
      const resultAction = await dispatch(updateInstallment({ id, newData }));

      if (updateInstallment.fulfilled.match(resultAction)) {
        showNotification({
          message: t('notifications.api.installment.edit.success'),
          color: 'green',
          icon: <IconCheck />,
        });
        navigate(`/payments/details/${id}`);
      } else {
        showNotification({
          message: t('notifications.api.installment.edit.error'),
          color: 'red',
          icon: <IconX />,
        });
        console.error(resultAction.payload);
      }
    } catch (error) {
      showNotification({
        message: t('notifications.api.installment.edit.error'),
        color: 'red',
        icon: <IconX />,
      });
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <PageHeader
        title={t('components.installments.edit.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.editPayment'),
            to: '/payments/edit',
            active: true,
          },
        ]}
        actions={
          <Button
            type='submit'
            form='edit-payment-form'
            variant='filled'
            size='xs'
            loading={updateInstallmentLoading}
            loaderProps={{
              children: <Loader size='sm' type='dots' color='white' />,
            }}
          >
            {t('buttons.installment.save.label')}
          </Button>
        }
      />

      <div className='relative w-full max-w-5xl mx-auto'>
        <LoadingOverlay
          visible={getInstallmentByIdLoading || updateInstallmentLoading}
          loaderProps={{
            children: getInstallmentByIdLoading ? (
              <Loader size='sm' type='dots' />
            ) : (
              <></>
            ),
          }}
          className={utilStyles.radiusMd}
        />

        <form
          id='edit-payment-form'
          onSubmit={handleSubmit(onSubmit)}
          className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-md shadow'
        >
          <div className='flex flex-col gap-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-md font-medium text-gray-700 mb-1'
              >
                {t('forms.installment.fields.name.label')}
              </label>
              <TextInput
                id='name'
                placeholder={t('forms.installment.fields.name.placeholder')}
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
                {t('forms.installment.fields.amount.label')}
              </label>
              <Controller
                control={control}
                name='amount'
                render={({ field }) => (
                  <NumberInput
                    id='totalAmount'
                    placeholder={t(
                      'forms.installment.fields.amount.placeholder'
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
                {t('forms.installment.fields.startDate.label')}
              </label>
              <Controller
                control={control}
                name='startDate'
                render={({ field }) => (
                  <DatePickerInput
                    disabled
                    value={field.value ? dayjs(field.value).toDate() : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? dayjs(date).format('YYYY-MM-DD') : ''
                      )
                    }
                    valueFormat='DD-MM-YYYY'
                    placeholder={t(
                      'forms.installment.fields.startDate.placeholder'
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
                {t('forms.installment.fields.monthCount.label')}
              </label>
              <Controller
                control={control}
                name='monthCount'
                render={({ field }) => (
                  <NumberInput
                    id='monthCount'
                    placeholder={t(
                      'forms.installment.fields.monthCount.placeholder'
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
                  {t('forms.installment.fields.monthlyPayments.label')}
                </p>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2 mb-2'>
                    <Controller
                      control={control}
                      name={`monthlyPayments.${index}.date`}
                      render={({ field }) => (
                        <DatePickerInput
                          disabled={fields[index].paid}
                          placeholder={t(
                            'forms.installment.fields.monthlyPayments.date.placeholder'
                          )}
                          value={
                            field.value ? dayjs(field.value).toDate() : null
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
                          disabled={fields[index].paid}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t(
                            'forms.installment.fields.monthlyPayments.amount.placeholder'
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
              <EmptyState
                icon={<IconCalendarClock size={32} color='gray' />}
                description={t(
                  'forms.installment.fields.monthlyPayments.empty.title'
                )}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInstallment;
