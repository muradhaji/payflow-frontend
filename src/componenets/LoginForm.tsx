import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';

const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, 'Username must be at least 6 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useAppSelector((state) => state.auth);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header
        rightElement={
          <Link
            to='/register'
            className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            Sign up
          </Link>
        }
      />
      <div className='flex-1 flex items-center justify-center p-3'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
            Log in to <span className='text-blue-600'>Pay</span>
            <span>Flow</span>
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <label
                htmlFor='username'
                className='block mb-1 font-medium text-gray-700'
              >
                Username
              </label>
              <input
                id='username'
                {...formRegister('username')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your username'
              />
              {errors.username && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block mb-1 font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                {...formRegister('password')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='••••••••'
              />
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
