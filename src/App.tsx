import { Route, Routes } from 'react-router-dom';
import Home from './componenets/Home';
import LoginForm from './componenets/LoginForm';
import RegisterForm from './componenets/RegisterForm';
import PrivateRoute from './componenets/PrivateRoute';
import FilteredInstallmentsCurrent from './componenets/FilteredInstallmentsCurrent';
import DashboardLayout from './componenets/DashboardLayout';
import DashboardCards from './componenets/DashboardCards';
import FilteredInstallmentsRemaining from './componenets/FilteredInstallmentsRemaining';
import FilteredInstallmentsPaid from './componenets/FilteredInstallmentsPaid';
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
import EditPayment from './componenets/EditPayment';

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
              <Route path='current' element={<FilteredInstallmentsCurrent />} />
              <Route
                path='remaining'
                element={<FilteredInstallmentsRemaining />}
              />
              <Route path='paid' element={<FilteredInstallmentsPaid />} />
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
              <Route path='edit/:id' element={<EditPayment />}></Route>
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
        </DatesProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
