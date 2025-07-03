import { Route, Routes } from 'react-router-dom';
import Home from './componenets/Home';
import LoginForm from './componenets/LoginForm';
import RegisterForm from './componenets/RegisterForm';
import PrivateRoute from './componenets/PrivateRoute';
import PaymentsCurrent from './componenets/PaymentsCurrent';
import DashboardLayout from './componenets/DashboardLayout';
import DashboardCards from './componenets/DashboardCards';
import './App.css';
import PaymentsRemaining from './componenets/PaymentsRemaining';
import PaymentsPaid from './componenets/PaymentsPaid';

function App() {
  return (
    <div className='font-sans'>
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
        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
