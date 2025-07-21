import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from '../../features/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const LoginSchema = yup.object().shape({
  username: yup.string().min(6, 'usernameMin').required('usernameRequired'),
  password: yup.string().min(8, 'passwordMin').required('passwordRequired'),
});

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error: apiError,
    token,
  } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors: formErrors },
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
    <div className='flex-1 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          <Trans
            i18nKey='auth.login.form.title'
            components={{
              1: <span className='text-blue-600' />,
              2: <span />,
            }}
          />
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label
              htmlFor='username'
              className='block mb-1 font-medium text-gray-700'
            >
              {t('auth.login.form.fields.username.label')}
            </label>
            <input
              id='username'
              {...formRegister('username')}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder={t('auth.login.form.fields.username.placeholder')}
            />
            {formErrors.username?.message && (
              <p className='text-red-500 text-sm mt-1'>
                {t(`auth.login.errors.form.${formErrors.username.message}`)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block mb-1 font-medium text-gray-700'
            >
              {t('auth.login.form.fields.password.label')}
            </label>
            <input
              id='password'
              type='password'
              {...formRegister('password')}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder={t('auth.login.form.fields.password.placeholder')}
            />
            {formErrors.password?.message && (
              <p className='text-red-500 text-sm mt-1'>
                {t(`auth.login.errors.form.${formErrors.password.message}`)}
              </p>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
          >
            {t(
              `auth.login.form.buttons.submit.${
                loading ? 'loadingLabel' : 'label'
              }`
            )}
          </button>
          {apiError && (
            <p className='text-red-500 text-sm'>
              {t(`auth.login.errors.api.${apiError}`, {
                defaultValue: t('auth.login.errors.api.default'),
              })}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
