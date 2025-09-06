import { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';

import { useParams, useNavigate } from 'react-router-dom';

import {
  useForm,
  Controller,
  useFieldArray,
  type FieldErrors,
  type FieldError,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  TextInput,
  NumberInput,
  Loader,
  LoadingOverlay,
  Button,
  Paper,
  Grid,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import { IconCalendarClock, IconCheck, IconX } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';

import { sumByKeyDecimal } from '../../../utils/math';
import utilStyles from '../../../styles/utils.module.css';

import type {
  InstallmentSchema,
  MonthlyPaymentSchema,
} from '../../../types/installment';

import {
  getInstallmentById,
  updateInstallment,
  clearSelectedInstallment,
} from '../../../features/installments/installmentsSlice';

import PageHeader from '../../common/PageHeader/PageHeader';
import EmptyState from '../../common/EmptyState/EmptyState';
import { useThemeColors } from '../../../hooks/useThemeColors';

import { installmentSchema } from '../../../constants/schema';
import { DATE_FORMATS } from '../../../constants/format';
import { VALIDATION } from '../../../constants/validation';

const EditInstallment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

  const {
    selectedInstallment,
    getInstallmentById: { loading: getInstallmentByIdLoading },
    updateInstallment: { loading: updateInstallmentLoading },
  } = useAppSelector((state) => state.installment);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<InstallmentSchema>({
    resolver: yupResolver(installmentSchema),
  });

  const { fields: monthlyPayments, replace } = useFieldArray({
    control,
    name: 'monthlyPayments',
  });

  const amount = watch('amount');
  const monthCount = watch('monthCount');
  const startDate = watch('startDate');
  const watchedMonthlyPayments = watch('monthlyPayments');

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
        startDate: dayjs(selectedInstallment.startDate).format(
          DATE_FORMATS.START_DATE
        ),
        monthCount: selectedInstallment.monthCount,
        monthlyPayments: selectedInstallment.monthlyPayments.map((p) => {
          return { ...p, date: dayjs(p.date).format(DATE_FORMATS.START_DATE) };
        }),
      });
    }
  }, [selectedInstallment, reset]);

  const generateMonthlyPayments = useCallback((): MonthlyPaymentSchema[] => {
    const paidPayments = monthlyPayments.filter((p) => p.paid);
    const newMonthCount = monthCount - paidPayments.length;
    const remainingAmount = +(
      amount - sumByKeyDecimal(paidPayments, 'amount')
    ).toFixed(2);

    if (
      !amount ||
      !monthCount ||
      !startDate ||
      newMonthCount <= 0 ||
      remainingAmount <= 0
    )
      return paidPayments;

    const monthlyPaymentBaseDate = dayjs(
      startDate,
      DATE_FORMATS.START_DATE
    ).add(paidPayments.length, 'month');

    const payments: MonthlyPaymentSchema[] = [];
    const baseAmount =
      Math.floor((remainingAmount * 100) / newMonthCount) / 100;
    const remaining = +(remainingAmount - baseAmount * newMonthCount).toFixed(
      2
    );

    for (let i = 0; i < newMonthCount; i++) {
      const date = monthlyPaymentBaseDate
        .add(i, 'month')
        .format(DATE_FORMATS.START_DATE);
      let amount = baseAmount;

      if (i === newMonthCount - 1) {
        amount = +(amount + remaining).toFixed(2);
      }

      payments.push({ date, amount: +amount.toFixed(2), paid: false });
    }

    return [...paidPayments, ...payments];
  }, [amount, monthCount]);

  useEffect(() => {
    const newPayments = generateMonthlyPayments();
    const isDifferent =
      JSON.stringify(newPayments) !== JSON.stringify(watchedMonthlyPayments);
    if (isDifferent) {
      replace(newPayments);
    }
  }, [amount, monthCount, replace, generateMonthlyPayments]);

  useEffect(() => {
    trigger('monthlyPayments');
  }, [amount, monthCount, trigger]);

  const onFormSubmit = async (newData: InstallmentSchema): Promise<void> => {
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

  const onFormError = (errors: FieldErrors<InstallmentSchema>) => {
    if (errors.monthlyPayments?.root) {
      showNotification({
        message: t(
          `forms.installment.errors.form.${errors.monthlyPayments?.root.message}`,
          {
            sum: sumByKeyDecimal(watchedMonthlyPayments, 'amount'),
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
            color={themedColor('blue', 'blue.4')}
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

      <Box pos='relative' maw={900} mx='auto' w='100%'>
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

        <Paper
          component='form'
          id='edit-payment-form'
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
                        disabled
                        value={field.value ? dayjs(field.value).toDate() : null}
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
                          count: Math.max(
                            VALIDATION.INSTALLMENT.MONTH_COUNT_MIN,
                            monthlyPayments.filter((payment) => payment.paid)
                              .length
                          ),
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
              {monthlyPayments.length > 0 ? (
                <Paper p='md' radius='md' withBorder>
                  <Text size='sm' fw={600} mb='sm'>
                    {t('forms.installment.fields.monthlyPayments.label')}
                  </Text>
                  <Stack gap='sm'>
                    {monthlyPayments.map((field, index) => (
                      <Grid key={field.id} gutter='xs' align='top'>
                        <Grid.Col span={'content'}>
                          <Controller
                            control={control}
                            name={`monthlyPayments.${index}.date`}
                            render={({ field }) => (
                              <DatePickerInput
                                disabled={monthlyPayments[index].paid}
                                placeholder={t(
                                  'forms.installment.fields.monthlyPayments.date.placeholder'
                                )}
                                value={
                                  field.value
                                    ? dayjs(field.value).toDate()
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
                                disabled={monthlyPayments[index].paid}
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
                                error={getErrorMessage(
                                  errors.monthlyPayments?.[index]?.amount
                                )}
                                size='md'
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

export default EditInstallment;
