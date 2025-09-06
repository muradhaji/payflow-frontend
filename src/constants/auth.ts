import type { AuthSliceState } from '../types/auth';

export const authInitialState: AuthSliceState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  delete: {
    modalOpened: false,
    loading: false,
    error: null,
  },
};
