import authReducer from '../features/auth/authSlice';
import storage from 'redux-persist/lib/storage';
import installmentsSlice from '../features/installments/installmentsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    installments: installmentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
