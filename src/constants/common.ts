export const STORAGE_KEYS = {
  USER: 'PAYFLOW_USER',
};

export const THUNKS = {
  AUTH: {
    LOGIN: 'auth/login',
    SIGNUP: 'auth/signup',
    DELETE_ME: 'auth/me',
  },
  INSTALLMENTS: {
    FETCH_ALL: 'installments/fetchAll',
    ADD: 'installments/add',
    UPDATE: 'installments/update',
    GET_BY_ID: 'installments/getById',
    DELETE: 'installments/delete',
    COMPLETE_PAYMENTS: 'installments/completePayments',
    CANCEL_PAYMENTS: 'installments/cancelPayments',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    DELETE_ME: '/api/auth/me',
  },
  INSTALLMENTS: {
    ROOT: '/api/installments',
    TOGGLE: '/api/installments/toggle',
  },
};
