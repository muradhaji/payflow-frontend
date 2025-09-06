import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';
import { VALIDATION } from '../constants/validation';

export const en = {
  components: {
    home: {
      intro: {
        title: 'Track Your Payments, <1 /> Stay on Top of Your Budget',
        description:
          "PayFlow is a simple and efficient platform for tracking your personal payments. <1 /> Easily record your monthly obligations, monitor how much you've paid so far, and keep an eye on your remaining balances.",
      },
    },
    emptyState: {
      default: {
        title: 'No data available',
        description: 'There is no data to display here.',
      },
    },
    installments: {
      all: {
        pageTitle: 'All Debts',
        empty: {
          title: 'No payments found',
          description: 'You have not added any payments yet.',
        },
      },
      add: {
        pageTitle: 'Add Payment',
      },
      edit: {
        pageTitle: 'Edit Payment',
      },
      card: {
        badge: {
          paid: 'PAID',
          active: 'ACTIVE',
        },
      },
      details: {
        pageTitle: 'Payment Details',
        label: {
          amount: 'Amount',
          startDate: 'Start date',
          createdAt: 'Created',
          updatedAt: 'Updated',
        },
      },
    },
    paymentsCard: {
      paid: {
        cardTitle: 'PAID',
        empty: {
          title: 'No payments completed',
        },
      },
      unpaid: {
        cardTitle: 'REMAINING',
        empty: {
          title: 'All payments are completed',
        },
      },
    },
    filters: {
      pageTitle: 'Payments',
      cards: {
        overdue: 'OVERDUE',
        current: 'THIS MONTH',
        remaining: 'UNPAID',
        paid: 'PAID',
        all: 'ALL',
      },
      overdue: {
        pageTitle: 'Overdue Debts',
        totalLabel: 'TOTAL AMOUNT',
        empty: {
          title: 'No Overdue Payments',
          description: 'You have no overdue payments for previous months.',
        },
      },
      current: {
        pageTitle: "This Month's Debts",
        totalLabel: 'TOTAL AMOUNT ({{month}})',
        empty: {
          title: 'All caught up!',
          description: 'You have no unpaid payments for the selected month.',
        },
      },
      remaining: {
        pageTitle: 'Unpaid Debts',
        totalLabel: 'TOTAL AMOUNT',
        empty: {
          title: 'No pending payments',
          description: 'All upcoming payments have been completed.',
        },
      },
      paid: {
        pageTitle: 'Paid Debts',
        totalLabel: 'TOTAL AMOUNT',
        empty: {
          title: 'No payments made yet',
          description: "You haven't completed any payments so far.",
        },
      },
    },
    filteredPaymentsTable: {
      accordionLabel: 'SEE PAYMENTS',
      tableHeader: {
        date: 'Date',
        amount: 'Amount',
      },
    },
    paymentItem: {
      paidLabel: 'Paid: {{date}}',
    },
    statsCard: {
      totalLabel: 'TOTAL DEBT:',
      paid: 'PAID',
      remaining: 'REMAINING',
    },
    monthlyStats: {
      empty: {
        description: 'No debts recorded for the year {{year}}.',
      },
    },
    notFound: {
      title: 'Nothing to see here',
      description:
        'The page you are trying to open does not exist. <1 /> You may have mistyped the address, or the page has been moved to another URL.',
      button: 'Take me back to home page',
    },
  },
  forms: {
    login: {
      title: 'Log in to <1>Pay</1><2>Flow</2>',
      signupPrompt: "Don't have an account?",
      signupLink: 'Sign up',
      fields: {
        username: {
          label: 'Username',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          placeholder: 'Enter your password',
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'Username is required.',
          [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
            'Must be at least 6 characters.',
          [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
            'Must be at most 20 characters.',
          [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
            'Can only contain lowercase letters and numbers.',

          [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Password is required.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
            'Must be at least 8 characters.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
            'Must be at most 20 characters.',
          [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
            'Must contain at least one letter and one number, cannot contain spaces.',
        },
      },
    },
    signup: {
      title: 'Sign up to <1>Pay</1><2>Flow</2>',
      loginPrompt: 'Already have an account?',
      loginLink: 'Log in',
      fields: {
        username: {
          label: 'Username',
          placeholder: 'Enter your username',
        },
        password: {
          label: 'Password',
          placeholder: 'Enter your password',
        },
        confirmPassword: {
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'Username is required.',
          [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
            'Must be at least 6 characters.',
          [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
            'Must be at most 20 characters.',
          [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
            'Can only contain lowercase letters and numbers.',

          [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Password is required.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
            'Must be at least 8 characters.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
            'Must be at most 20 characters.',
          [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
            'Must contain at least one letter and one number, cannot contain spaces.',

          [ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_REQUIRED]:
            'Confirm password is required.',
          [ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_MATCH]: 'Passwords must match.',
        },
      },
    },
    installment: {
      fields: {
        title: {
          label: 'Title',
          placeholder: 'Enter payment title',
        },
        amount: {
          label: 'Amount',
          placeholder: 'Enter payment amount',
        },
        startDate: {
          label: 'Start Date',
          placeholder: 'Select start date',
        },
        monthCount: {
          label: 'Number of Months',
          placeholder: 'Enter number of months',
        },
        monthlyPayments: {
          label: 'Monthly payments',
          empty: {
            title: 'Monthly payments will appear once the form is filled.',
          },
          date: {
            placeholder: 'Pick a date',
          },
          amount: {
            placeholder: 'Enter amount',
          },
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.INSTALLMENT.TITLE_REQUIRED]: 'Title is required.',
          [ERROR_MESSAGES.INSTALLMENT.TITLE_STRING]: 'Title must be a string.',
          [ERROR_MESSAGES.INSTALLMENT
            .TITLE_MIN_LENGTH]: `Must be at least ${VALIDATION.INSTALLMENT.TITLE_MIN_LENGTH} characters.`,
          [ERROR_MESSAGES.INSTALLMENT
            .TITLE_MAX_LENGTH]: `Must be at most ${VALIDATION.INSTALLMENT.TITLE_MAX_LENGTH} characters.`,

          [ERROR_MESSAGES.INSTALLMENT.AMOUNT_REQUIRED]: 'Amount is required.',
          [ERROR_MESSAGES.INSTALLMENT.AMOUNT_NUMBER]:
            'Amount must be a number.',
          [ERROR_MESSAGES.INSTALLMENT
            .AMOUNT_POSITIVE]: `Amount must be positive.`,

          [ERROR_MESSAGES.INSTALLMENT.START_DATE_REQUIRED]:
            'Start date is required.',
          [ERROR_MESSAGES.INSTALLMENT.START_DATE_STRING]:
            'Start date must be a string.',
          [ERROR_MESSAGES.INSTALLMENT.START_DATE_INVALID]:
            'Start date is not valid.',

          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_REQUIRED]:
            'Month count is required.',
          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_NUMBER]:
            'Month count must be a number.',
          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_MIN]:
            'At least {{count}} month(s) required.',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_REQUIRED]:
            'Monthly payments are required.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_ARRAY]:
            'Monthly payments must be an array.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_COUNT_MISMATCH]:
            'Number of monthly payments must equal month count.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_TOTAL_MISMATCH]:
            'Sum of monthly payments ({{sum}} ₼) must equal total amount ({{amount}} ₼).',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_REQUIRED]:
            'Payment date is required.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_STRING]:
            'Payment date must be a string.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_INVALID]:
            'Payment date is not valid.',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_REQUIRED]:
            'Payment amount is required.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_NUMBER]:
            'Payment amount must be a number.',
          [ERROR_MESSAGES.INSTALLMENT
            .MONTHLY_PAYMENT_AMOUNT_POSITIVE]: `Payment amount must be greater than ${VALIDATION.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_MIN}.`,
        },
      },
    },
  },
  buttons: {
    login: {
      label: 'LOG IN',
    },
    logout: {
      label: 'LOG OUT',
    },
    signup: {
      label: 'SIGN UP',
    },
    getStarted: {
      label: 'GET STARTED',
    },
    otherProjects: {
      label: 'VIEW OTHER PROJECTS',
    },
    installment: {
      add: {
        label: 'ADD',
        tooltip: 'Add new payment',
      },
      save: {
        label: 'SAVE',
      },
      edit: {
        label: 'EDIT',
      },
      delete: {
        label: 'DELETE',
      },
    },
    payments: {
      label: 'PAYMENTS',
    },
    menu: {
      label: 'MENU',
    },
    completePayments: {
      label: 'COMPLETE',
      tooltip: 'Select payments to complete',
    },
    cancelPayments: {
      label: 'CANCEL',
      tooltip: 'Select payments to cancel',
    },
    selectAll: {
      label: 'ALL',
      tooltip: 'Select all payments',
    },
    confirm: {
      label: 'CONFIRM',
    },
    cancel: {
      label: 'CANCEL',
    },
    deleteUser: {
      label: 'DELETE ACCOUNT',
    },
  },
  breadcrumbs: {
    payments: 'Payments',
    filterOverdue: 'Overdue',
    filterCurrent: 'This Month',
    filterPaid: 'Paid',
    filterRemaining: 'Unpaid',
    allPayments: 'All',
    details: 'Details',
    addPayment: 'Add',
    editPayment: 'Edit',
  },
  tooltips: {
    details: 'Details',
    monthSelector: 'Select the month and year to view payments.',
    selectAll: 'Select all',
  },
  notifications: {
    api: {
      completePayments: {
        success: 'Payments completed successfully.',
        error: 'Failed to complete payments.',
      },
      cancelPayments: {
        success: 'Payments cancelled successfully.',
        error: 'Failed to cancel payments.',
      },
      installment: {
        add: {
          success: 'Payment created successfully.',
          error: 'Failed to create the payment.',
        },
        edit: {
          success: 'Payment updated successfully.',
          error: 'Failed to update the payment.',
        },
        delete: {
          success: 'Payment deleted successfully.',
          error: 'Failed to delete the payment.',
        },
      },
    },
  },
  modals: {
    installment: {
      delete: {
        title: 'Delete payment',
        message:
          'Are you sure you want to delete this payment? This action cannot be undone.',
      },
    },
    auth: {
      delete: {
        title: 'Delete account',
        message:
          'Deleting your account will remove all your data permanently! <1/> To delete your account, you must confirm your password.',
      },
    },
  },
  apiErrorMessages: {
    [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'Username is required.',
    [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
      'Username must be at least 6 characters.',
    [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
      'Username must be at most 20 characters.',
    [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
      'Username can only contain lowercase letters and numbers.',
    [ERROR_MESSAGES.AUTH.USERNAME_EXISTS]: 'Username already exists.',

    [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Password is required.',
    [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
      'Password must be at least 8 characters.',
    [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
      'Password must be at most 20 characters.',
    [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
      'Password must contain at least one letter and one number, cannot contain spaces.',
    [ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT]: 'Incorrect password.',

    [ERROR_MESSAGES.AUTH.TOKEN_NOT_PROVIDED]:
      'Authentication token not provided.',
    [ERROR_MESSAGES.AUTH.TOKEN_INVALID]: 'Invalid authentication token.',

    [ERROR_MESSAGES.AUTH.USER_NOT_FOUND]: 'User not found.',

    [ERROR_MESSAGES.UNKNOWN]:
      'An unknown error occurred. Please try again later.',
  },
  apiSuccessMessages: {
    [SUCCESS_MESSAGES.AUTH.USER_DELETED]: 'User has been deleted successfully.',

    [SUCCESS_MESSAGES.COMMON]: 'Operation completed successfully.',
  },
};
