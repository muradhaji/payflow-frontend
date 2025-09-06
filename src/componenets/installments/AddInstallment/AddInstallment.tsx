import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useForm,
  useFieldArray,
  Controller,
  type FieldError,
  type FieldErrors,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import dayjs from 'dayjs';
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

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';

import { addInstallment } from '../../../features/installments/installmentsSlice';
import { sumByKeyDecimal } from '../../../utils/math';
import utilStyles from '../../../styles/utils.module.css';

import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useThemeColors } from '../../../hooks/useThemeColors';

import { VALIDATION } from '../../../constants/validation';
import { DATE_FORMATS } from '../../../constants/format';
import { installmentSchema } from '../../../constants/schema';
import type {
  InstallmentSchema,
  MonthlyPaymentSchema,
} from '../../../types/installment';

const AddInstallment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    addInstallment: { loading },
  } = useAppSelector((state) => state.installment);

  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InstallmentSchema>({
    reValidateMode: 'onChange',
    defaultValues: {
      startDate: dayjs()
        .add(1, 'month')
        .startOf('month')
        .format(DATE_FORMATS.START_DATE),
      monthCount: 1,
      monthlyPayments: [],
    },
    resolver: yupResolver(installmentSchema),
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'monthlyPayments',
  });

  const amount = watch('amount');
  const monthCount = watch('monthCount');
  const startDate = watch('startDate');
  const monthlyPayments = watch('monthlyPayments');

  const generateMonthlyPayments = useCallback((): MonthlyPaymentSchema[] => {
    if (!amount || !monthCount || !startDate) return [];

    const base = dayjs(startDate, DATE_FORMATS.START_DATE);
    const payments: MonthlyPaymentSchema[] = [];
    const baseAmount = Math.floor((amount * 100) / monthCount) / 100;
    const remaining = +(amount - baseAmount * monthCount).toFixed(2);

    for (let i = 0; i < monthCount; i++) {
      const date = base.add(i, 'month').format(DATE_FORMATS.START_DATE);
      let amount = baseAmount;

      if (i === monthCount - 1) {
        amount = +(amount + remaining).toFixed(2);
      }

      payments.push({ date, amount: +amount.toFixed(2) });
    }

    return payments;
  }, [amount, monthCount, startDate]);

  useEffect(() => {
    replace(generateMonthlyPayments());
  }, [amount, monthCount, startDate, replace, generateMonthlyPayments]);

  const onFormSubmit = async (data: InstallmentSchema): Promise<void> => {
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

  const onFormError = (errors: FieldErrors<InstallmentSchema>) => {
    if (errors.monthlyPayments?.root) {
      showNotification({
        message: t(
          `forms.installment.errors.form.${errors.monthlyPayments?.root.message}`,
          {
            sum: sumByKeyDecimal(monthlyPayments, 'amount'),
            amount: amount,
          }
        ),
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const getErrorMessage = (
    error?: FieldError,
    translateParams?: Record<string, unknown>
  ) => {
    if (!error?.message) return undefined;

    return t(`forms.installment.errors.form.${error.message}`, translateParams);
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
          onSubmit={handleSubmit(onFormSubmit, onFormError)}
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
                    {t('forms.installment.fields.title.label')}
                  </Text>

                  <TextInput
                    id='name'
                    placeholder={t(
                      'forms.installment.fields.title.placeholder'
                    )}
                    {...register('title')}
                    size='md'
                    error={getErrorMessage(errors.title)}
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
                        error={getErrorMessage(errors.amount)}
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
                            ? dayjs(
                                field.value,
                                DATE_FORMATS.START_DATE
                              ).toDate()
                            : null
                        }
                        onChange={(date) =>
                          field.onChange(
                            date
                              ? dayjs(date).format(DATE_FORMATS.START_DATE)
                              : ''
                          )
                        }
                        valueFormat={DATE_FORMATS.START_DATE_SHOW}
                        placeholder={t(
                          'forms.installment.fields.startDate.placeholder'
                        )}
                        id='startDate'
                        size='md'
                        error={getErrorMessage(errors.startDate)}
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
                        error={getErrorMessage(errors.monthCount, {
                          count: VALIDATION.INSTALLMENT.MONTH_COUNT_MIN,
                        })}
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
                  <Text size='sm' fw={600} mb='sm'>
                    {t('forms.installment.fields.monthlyPayments.label')}
                  </Text>
                  <Stack gap='sm'>
                    {fields.map((field, index) => (
                      <Grid key={field.id} gutter='xs' align='top'>
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
                                    ? dayjs(
                                        field.value,
                                        DATE_FORMATS.START_DATE
                                      ).toDate()
                                    : null
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    date
                                      ? dayjs(date).format(
                                          DATE_FORMATS.START_DATE
                                        )
                                      : ''
                                  )
                                }
                                minDate={dayjs(field.value)
                                  .startOf('month')
                                  .toDate()}
                                maxDate={dayjs(field.value)
                                  .endOf('month')
                                  .toDate()}
                                valueFormat={DATE_FORMATS.START_DATE_SHOW}
                                error={getErrorMessage(
                                  errors.monthlyPayments?.[index]?.date
                                )}
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
                                error={getErrorMessage(
                                  errors.monthlyPayments?.[index]?.amount
                                )}
                              />
                            )}
                          />
                        </Grid.Col>
                      </Grid>
                    ))}
                  </Stack>
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
