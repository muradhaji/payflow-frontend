import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import installmentsSlice from '../features/installments/installmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    installments: installmentsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
