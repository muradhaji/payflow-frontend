import { Route, Routes } from 'react-router-dom';
import Home from './componenets/Home';
import LoginForm from './componenets/LoginForm';
import RegisterForm from './componenets/RegisterForm';
import PrivateRoute from './componenets/PrivateRoute';
import PaymentsCurrent from './componenets/PaymentsCurrent';
import DashboardLayout from './componenets/DashboardLayout';
import DashboardCards from './componenets/DashboardCards';
import PaymentsRemaining from './componenets/PaymentsRemaining';
import PaymentsPaid from './componenets/PaymentsPaid';
import PaymentsLayout from './componenets/PaymentsLayout';
import AddPayment from './componenets/AddPayment';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  return (
    <div className='font-sans'>
      <MantineProvider defaultColorScheme='light'>
        <Notifications position='top-center' />
        <DatesProvider settings={{ locale: i18n.language }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardCards />} />
              <Route path='current' element={<PaymentsCurrent />} />
              <Route path='remaining' element={<PaymentsRemaining />} />
              <Route path='paid' element={<PaymentsPaid />} />
              {/* <Route path='all' element={<PaymentsAll />} /> */}
            </Route>
            <Route
              path='/payments'
              element={
                <PrivateRoute>
                  <PaymentsLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<>Payments</>}></Route>
              <Route path='add' element={<AddPayment />}></Route>
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
        </DatesProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
