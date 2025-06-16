import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { Trans, useTranslation } from 'react-i18next';

const RegisterSchema = yup.object().shape({
  username: yup.string().min(6, 'usernameMin').required('usernameRequired'),
  password: yup.string().min(8, 'passwordMin').required('passwordRequired'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'confirmPasswordMatch')
    .required('confirmPasswordRequired'),
});

type RegisterFormInputs = {
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error: registerAPIError } = useAppSelector(
    (state) => state.auth
  );
  const { t } = useTranslation();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await dispatch(register(data)).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header
        rightElement={
          <Link
            to='/login'
            className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            {t('registerForm.header.loginButton')}
          </Link>
        }
      />
      <div className='flex-1 flex items-center justify-center p-3'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
            <Trans
              i18nKey='registerForm.form.title'
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
                {t('registerForm.form.fields.username.label')}
              </label>
              <input
                id='username'
                {...formRegister('username')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t('registerForm.form.fields.username.placeholder')}
              />
              {formErrors.username?.message && (
                <p className='text-red-500 text-sm mt-1'>
                  {t(
                    `registerForm.form.fields.username.${formErrors.username.message}`
                  )}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block mb-1 font-medium text-gray-700'
              >
                {t('registerForm.form.fields.password.label')}
              </label>
              <input
                id='password'
                type='password'
                {...formRegister('password')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t('registerForm.form.fields.password.placeholder')}
              />
              {formErrors.password?.message && (
                <p className='text-red-500 text-sm mt-1'>
                  {t(
                    `registerForm.form.fields.password.${formErrors.password.message}`
                  )}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block mb-1 font-medium text-gray-700'
              >
                {t('registerForm.form.fields.confirmPassword.label')}
              </label>
              <input
                id='confirmPassword'
                type='password'
                {...formRegister('confirmPassword')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t(
                  'registerForm.form.fields.confirmPassword.placeholder'
                )}
              />
              {formErrors.confirmPassword?.message && (
                <p className='text-red-500 text-sm mt-1'>
                  {t(
                    `registerForm.form.fields.confirmPassword.${formErrors.confirmPassword.message}`
                  )}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
              disabled={loading}
            >
              {t(`registerForm.form.${loading ? 'submitting' : 'submit'}`)}
            </button>

            {registerAPIError && (
              <p className='text-red-500 text-sm'>
                {t(`registerForm.registerAPIError.${registerAPIError}`, {
                  defaultValue: t('registerForm.registerAPIError.default'),
                })}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
