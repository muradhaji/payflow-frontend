import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from '../../features/auth/authSlice';
import { useThemeColors } from '../../hooks/useThemeColors';

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
  const { themedColor } = useThemeColors();

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
      navigate('/payments', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/payments', { replace: true });
    }
  }, [token, navigate]);

  return (
    <Flex flex={1} align='center' justify='center' p='md'>
      <Card
        p='lg'
        bg={themedColor('white', 'dark.7')}
        withBorder
        bdrs='sm'
        shadow='md'
        w='100%'
        maw={400}
      >
        <Stack gap='xl'>
          <Title order={2} size='h2' fw={700} ta='center'>
            <Trans
              i18nKey='forms.login.title'
              components={{
                1: <Text span c={themedColor('blue', 'blue.4')} inherit />,
                2: <Text span c={themedColor('gray.9', 'dark.0')} inherit />,
              }}
            />
          </Title>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap='md'>
              <TextInput
                label={t('forms.login.fields.username.label')}
                labelProps={{ mb: 'xs' }}
                placeholder={t('forms.login.fields.username.placeholder')}
                {...formRegister('username')}
                error={
                  formErrors.username
                    ? t(
                        `forms.login.errors.form.${formErrors.username.message}`
                      )
                    : null
                }
                disabled={loading}
                radius='sm'
                size='md'
              />

              <PasswordInput
                label={t('forms.login.fields.password.label')}
                labelProps={{ mb: 'xs' }}
                placeholder={t('forms.login.fields.password.placeholder')}
                {...formRegister('password')}
                error={
                  formErrors.password
                    ? t(
                        `forms.login.errors.form.${formErrors.password.message}`
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
                color={themedColor('blue', 'blue.4')}
                radius='sm'
              >
                {t(`buttons.login.label`)}
              </Button>

              {apiError && (
                <Text c='red' size='sm'>
                  {t(`forms.login.errors.api.${apiError}`, {
                    defaultValue: t('forms.login.errors.api.default'),
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

export default Login;
