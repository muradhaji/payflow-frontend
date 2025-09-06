import * as yup from 'yup';

import { ERROR_MESSAGES } from './messages';
import { VALIDATION } from './validation';
import { REGEX } from './regex';

import { sumByKeyDecimal } from '../utils/math';
import type { InstallmentSchema } from '../types/installment';

const monthlyPaymentSchema = yup.object({
  date: yup
    .string()
    .required(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_STRING)
    .matches(
      REGEX.INSTALLMENT.MONTHLY_PAYMENT_DATE,
      ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_INVALID
    ),
  amount: yup
    .number()
    .required(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_NUMBER)
    .positive(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_POSITIVE)
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),
  paid: yup.boolean().optional(),
});

export const installmentSchema = yup.object({
  title: yup
    .string()
    .required(ERROR_MESSAGES.INSTALLMENT.TITLE_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.TITLE_STRING)
    .min(
      VALIDATION.INSTALLMENT.TITLE_MIN_LENGTH,
      ERROR_MESSAGES.INSTALLMENT.TITLE_MIN_LENGTH
    )
    .max(
      VALIDATION.INSTALLMENT.TITLE_MAX_LENGTH,
      ERROR_MESSAGES.INSTALLMENT.TITLE_MAX_LENGTH
    ),

  amount: yup
    .number()
    .required(ERROR_MESSAGES.INSTALLMENT.AMOUNT_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.AMOUNT_NUMBER)
    .positive(ERROR_MESSAGES.INSTALLMENT.AMOUNT_POSITIVE)
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  startDate: yup
    .string()
    .required(ERROR_MESSAGES.INSTALLMENT.START_DATE_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.START_DATE_STRING)
    .matches(
      REGEX.INSTALLMENT.START_DATE,
      ERROR_MESSAGES.INSTALLMENT.START_DATE_INVALID
    ),

  monthCount: yup
    .number()
    .required(ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_NUMBER)
    .min(
      VALIDATION.INSTALLMENT.MONTH_COUNT_MIN,
      ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_MIN
    )
    .test(
      'month-count-min',
      ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_MIN,
      function (monthCount) {
        const { monthlyPayments } = this.parent as InstallmentSchema;
        const paidCount =
          monthlyPayments?.filter((payment) => payment.paid).length || 0;

        return monthCount >= paidCount;
      }
    )
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  monthlyPayments: yup
    .array()
    .required(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_REQUIRED)
    .typeError(ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_ARRAY)
    .of(monthlyPaymentSchema)
    .test(
      'total-mismatch',
      ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_TOTAL_MISMATCH,
      function (monthlyPayments) {
        const { amount } = this.parent as InstallmentSchema;

        if (!monthlyPayments || !amount) return true;

        const sum = sumByKeyDecimal(monthlyPayments, 'amount');

        return sum.toFixed(2) === amount.toFixed(2);
      }
    )
    .test(
      'count-mismatch',
      ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_COUNT_MISMATCH,
      function (monthlyPayments) {
        const { monthCount } = this.parent as InstallmentSchema;

        if (!monthlyPayments || !monthCount) return true;

        return monthlyPayments.length === monthCount;
      }
    ),
});
