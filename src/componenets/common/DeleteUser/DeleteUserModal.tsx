import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Trans, useTranslation } from 'react-i18next';

import {
  Modal,
  Button,
  Text,
  Group,
  Loader,
  PasswordInput,
} from '@mantine/core';

import type { DeleteCredentials } from '../../../types/auth';

import { ERROR_MESSAGES } from '../../../constants/messages';

interface DeleteUserModal {
  opened: boolean;
  onClose: () => void;
  onConfirm: (data: DeleteCredentials) => Promise<void>;
  confirmLoading: boolean;
}

const DeleteUserModal = ({
  opened,
  onClose,
  onConfirm,
  confirmLoading,
}: DeleteUserModal) => {
  const { t } = useTranslation();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    password: string;
  }>({
    resolver: yupResolver(
      yup.object({
        password: yup.string().required(ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED),
      })
    ),
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (!opened) {
      reset();
    }
  }, [opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600}>{t('modals.auth.delete.title')}</Text>}
      centered
    >
      <Text size='sm' mb='md'>
        <Trans
          i18nKey={'modals.auth.delete.message'}
          components={{ 1: <br /> }}
        />
      </Text>
      <form onSubmit={handleSubmit(onConfirm)} noValidate>
        <PasswordInput
          {...formRegister('password')}
          size='md'
          radius='sm'
          mb='md'
          placeholder={t('forms.login.fields.password.placeholder')}
          disabled={confirmLoading}
          required
          error={
            errors.password?.message &&
            t(`forms.login.errors.form.${errors.password?.message}`)
          }
        />

        <Group justify='right' gap='xs'>
          <Button
            variant='default'
            size='xs'
            onClick={onClose}
            disabled={confirmLoading}
          >
            {t('buttons.cancel.label')}
          </Button>
          <Button
            type='submit'
            color='red'
            size='xs'
            loading={confirmLoading}
            loaderProps={{
              children: <Loader size='sm' type='dots' color='white' />,
            }}
          >
            {t('buttons.confirm.label')}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default DeleteUserModal;
