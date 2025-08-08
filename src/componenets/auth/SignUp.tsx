import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  Flex,
  Loader,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

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

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error: apiError } = useAppSelector((state) => state.auth);
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
      navigate('/payments', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex flex={1} align='center' justify='center' p='md'>
      <Card
        p='lg'
        bg='white'
        withBorder
        bdrs='sm'
        shadow='md'
        w='100%'
        maw={400}
      >
        <Stack gap='xl'>
          <Title order={2} size='h2' fw={700} ta='center'>
            <Trans
              i18nKey='forms.signup.title'
              components={{
                1: <Text span c='blue.6' inherit />,
                2: <Text span c='gray.9' inherit />,
              }}
            />
          </Title>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap='md'>
              <TextInput
                label={t('forms.signup.fields.username.label')}
                labelProps={{ mb: 'xs' }}
                placeholder={t('forms.signup.fields.username.placeholder')}
                {...formRegister('username')}
                error={
                  formErrors.username
                    ? t(
                        `forms.signup.errors.form.${formErrors.username.message}`
                      )
                    : null
                }
                disabled={loading}
                radius='sm'
                size='md'
              />

              <PasswordInput
                label={t('forms.signup.fields.password.label')}
                labelProps={{ mb: 'xs' }}
                placeholder={t('forms.signup.fields.password.placeholder')}
                {...formRegister('password')}
                error={
                  formErrors.password
                    ? t(
                        `forms.signup.errors.form.${formErrors.password.message}`
                      )
                    : null
                }
                disabled={loading}
                radius='sm'
                size='md'
              />

              <PasswordInput
                label={t('forms.signup.fields.confirmPassword.label')}
                labelProps={{ mb: 'xs' }}
                placeholder={t(
                  'forms.signup.fields.confirmPassword.placeholder'
                )}
                {...formRegister('confirmPassword')}
                error={
                  formErrors.confirmPassword
                    ? t(
                        `forms.signup.errors.form.${formErrors.confirmPassword.message}`
                      )
                    : null
                }
                disabled={loading}
                radius='sm'
                size='md'
              />

              <Button
                type='submit'
                fullWidth
                size='sm'
                loading={loading}
                loaderProps={{
                  children: <Loader size='sm' type='dots' color='white' />,
                }}
                color='blue'
                radius='sm'
              >
                {t(`buttons.signup.label`)}
              </Button>

              {apiError && (
                <Text c='red' size='sm'>
                  {t(`forms.signup.errors.api.${apiError}`, {
                    defaultValue: t('forms.signup.errors.api.default'),
                  })}
                </Text>
              )}
            </Stack>
          </form>
        </Stack>
      </Card>
    </Flex>
  );
};

export default SignUp;
