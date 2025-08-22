import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DatePickerInput } from '@mantine/dates';
import {
  Button,
  Loader,
  LoadingOverlay,
  NumberInput,
  TextInput,
  Paper,
  Grid,
  Stack,
  Text,
  Box,
} from '@mantine/core';

import { IconCalendarClock, IconCheck, IconX } from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTranslation } from 'react-i18next';

import { addInstallment } from '../../../features/installments/installmentsSlice';
import { showNotification } from '@mantine/notifications';

import { sumByKeyDecimal } from '../../../utils/math';
import utilStyles from '../../../styles/utils.module.css';

import type {
  InstallmentCreate,
  MonthlyPaymentCreate,
} from '../../../types/installment';

import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useThemeColors } from '../../../hooks/useThemeColors';

const AddInstallment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    addInstallment: { loading },
  } = useAppSelector((state) => state.installments);

  const { t, i18n } = useTranslation();
  const { themedColor } = useThemeColors();

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
          .min(
            1,
            t('forms.installment.errors.form.monthCountMin', { paidCount: 1 })
          )
          .required(t('forms.installment.errors.form.monthCountRequired'))
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
            })
          )
          .default([])
          .test('sum-mismatch', function (monthlyPayments) {
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
          message: t('notifications.api.installment.add.success'),
          color: 'green',
          icon: <IconCheck />,
        });
        navigate(`/payments/details/${resultAction.payload._id}`);
      } else {
        showNotification({
          message: t('notifications.api.installment.add.error'),
          color: 'red',
          icon: <IconX />,
        });
        console.error(resultAction.payload);
      }
    } catch (error) {
      showNotification({
        message: t('notifications.api.installment.add.error'),
        color: 'red',
        icon: <IconX />,
      });
      console.error(error);
    }
  };

  return (
    <Stack gap='md'>
      <PageHeader
        title={t('components.installments.add.pageTitle')}
        breadcrumbs={[
          { label: t('breadcrumbs.payments'), to: '/payments' },
          {
            label: t('breadcrumbs.addPayment'),
            to: '/payments/add',
            active: true,
          },
        ]}
        actions={
          <Button
            type='submit'
            form='add-payment-form'
            variant='filled'
            color={themedColor('blue', 'blue.4')}
            size='xs'
            loading={loading}
            loaderProps={{
              children: <Loader size='sm' type='dots' color='white' />,
            }}
          >
            {t('buttons.installment.add.label')}
          </Button>
        }
      />

      <Box pos='relative' maw={900} mx='auto' w='100%'>
        <LoadingOverlay
          visible={loading}
          loaderProps={{ children: <></> }}
          className={utilStyles.radiusMd}
        />
        <Paper
          component='form'
          id='add-payment-form'
          onSubmit={handleSubmit(onSubmit)}
          radius='md'
          shadow='sm'
          p='md'
          withBorder
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap='md'>
                <Box>
                  <Text size='sm' fw={500} mb={4}>
                    {t('forms.installment.fields.name.label')}
                  </Text>

                  <TextInput
                    id='name'
                    placeholder={t('forms.installment.fields.name.placeholder')}
                    {...register('title')}
                    size='md'
                    error={errors.title?.message}
                  />
                </Box>

                <Box>
                  <Text size='sm' fw={500} mb={4}>
                    {t('forms.installment.fields.amount.label')}
                  </Text>

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
                </Box>

                <Box>
                  <Text size='sm' fw={500} mb={4}>
                    {t('forms.installment.fields.startDate.label')}
                  </Text>
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
                          'forms.installment.fields.startDate.placeholder'
                        )}
                        id='startDate'
                        size='md'
                        error={errors.startDate?.message}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Text size='sm' fw={500} mb={4}>
                    {t('forms.installment.fields.monthCount.label')}
                  </Text>

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
                </Box>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              {fields.length > 0 ? (
                <Paper p='md' radius='md' withBorder>
                  <Text fw={600} mb='sm'>
                    {t('forms.installment.fields.monthlyPayments.label')}
                  </Text>
                  <Stack gap='sm'>
                    {fields.map((field, index) => (
                      <Grid key={field.id} gutter='xs' align='center'>
                        <Grid.Col span={'content'}>
                          <Controller
                            control={control}
                            name={`monthlyPayments.${index}.date`}
                            render={({ field }) => (
                              <DatePickerInput
                                placeholder={t(
                                  'forms.installment.fields.monthlyPayments.date.placeholder'
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
                                minDate={dayjs(field.value)
                                  .startOf('month')
                                  .toDate()}
                                maxDate={dayjs(field.value)
                                  .endOf('month')
                                  .toDate()}
                                valueFormat='DD-MM-YYYY'
                                error={errors.startDate?.message}
                                className='whitespace-nowrap'
                                size='md'
                              />
                            )}
                          />
                        </Grid.Col>

                        <Grid.Col span={'auto'}>
                          <Controller
                            control={control}
                            name={`monthlyPayments.${index}.amount`}
                            render={({ field }) => (
                              <NumberInput
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
                                  errors.monthlyPayments?.[index]?.amount
                                    ?.message
                                }
                              />
                            )}
                          />
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Stack>
                  {errors?.monthlyPayments?.root?.message && (
                    <Text c='red' size='sm' mt='xs'>
                      {errors?.monthlyPayments?.root?.message}
                    </Text>
                  )}
                </Paper>
              ) : (
                <EmptyState
                  icon={<IconCalendarClock size={32} color='gray' />}
                  description={t(
                    'forms.installment.fields.monthlyPayments.empty.title'
                  )}
                />
              )}
            </Grid.Col>
          </Grid>
        </Paper>
      </Box>
    </Stack>
  );
};

export default AddInstallment;
