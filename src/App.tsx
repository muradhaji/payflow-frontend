import { Route, Routes } from 'react-router-dom';

import { createTheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

import Home from './componenets/Home';
import Login from './componenets/auth/Login';
import SignUp from './componenets/auth/SignUp';
import PrivateRoute from './componenets/auth/PrivateRoute';

import Filters from './componenets/filters/Filters';
import FilterCurrent from './componenets/filters/FilterCurrent';
import FilterRemaining from './componenets/filters/FilterRemaining';
import FilterPaid from './componenets/filters/FilterPaid';

import InstallmentsLayout from './componenets/installments/InstallmentsLayout';
import AllInstallments from './componenets/installments/AllInstallments/AllInstallments';
import AddInstallment from './componenets/installments/AddInstallment/AddInstallment';
import EditInstallment from './componenets/installments/EditInstallment/EditInstallment';
import InstallmentDetails from './componenets/installments/InstallmentDetails.tsx/InstallmentDetails';

import Layout from './componenets/common/Layout/Layout';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

const theme = createTheme({
  breakpoints: {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px',
  },
});

function App() {
  const { i18n } = useTranslation();

  return (
    <div className='font-sans'>
      <MantineProvider defaultColorScheme='light' theme={theme}>
        <Notifications position='top-center' />
        <DatesProvider settings={{ locale: i18n.language }}>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='/register' element={<SignUp />} />

              <Route
                path='/payments'
                element={
                  <PrivateRoute>
                    <InstallmentsLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Filters />} />

                <Route path='current' element={<FilterCurrent />} />
                <Route path='remaining' element={<FilterRemaining />} />
                <Route path='paid' element={<FilterPaid />} />

                <Route path='all' element={<AllInstallments />} />
                <Route path='add' element={<AddInstallment />}></Route>
                <Route path='edit/:id' element={<EditInstallment />}></Route>
                <Route
                  path='details/:id'
                  element={<InstallmentDetails />}
                ></Route>
              </Route>
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
        </DatesProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
