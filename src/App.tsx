import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { useEffect } from 'react';
import { loadUserFromStorage } from './features/auth/authSlice';
import Home from './componenets/Home';
import LoginForm from './componenets/LoginForm';
import RegisterForm from './componenets/RegisterForm';
import Dashboard from './componenets/Dashboard';
import PrivateRoute from './componenets/PrivateRoute';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

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
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
