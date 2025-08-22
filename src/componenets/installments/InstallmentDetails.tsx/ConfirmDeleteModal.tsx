import { Modal, Button, Text, Group, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmLoading: boolean;
}

const ConfirmDeleteModal = ({
  opened,
  onClose,
  onConfirm,
  confirmLoading,
}: ConfirmDeleteModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600}>{t('modals.installment.delete.title')}</Text>}
      centered
    >
      <Text size='sm' mb='md'>
        {t('modals.installment.delete.message')}
      </Text>

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
          color='red'
          size='xs'
          onClick={onConfirm}
          loading={confirmLoading}
          loaderProps={{
            children: <Loader size='sm' type='dots' color='white' />,
          }}
        >
          {t('buttons.confirm.label')}
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmDeleteModal;
