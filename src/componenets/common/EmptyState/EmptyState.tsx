import { Box, Stack, Text } from '@mantine/core';
import { IconFolderX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode | boolean;
  title?: string | boolean;
  description?: string | boolean;
  my?: string;
};

const EmptyState = ({
  icon,
  title,
  description,
  my = 'xl',
}: EmptyStateProps) => {
  const { t } = useTranslation();

  const defaultIcon = <IconFolderX size={48} color='gray' />;
  const defaultTitle = t('components.emptyState.default.title');
  const defaultDescription = t('components.emptyState.default.description');

  const renderIcon = icon === true ? defaultIcon : icon ?? null;

  const renderTitle = title === true ? defaultTitle : title ?? null;

  const renderDescription =
    description === true ? defaultDescription : description ?? null;

  return (
    <Box my={my}>
      <Stack align='center' gap='xs'>
        {renderIcon && renderIcon}
        {renderTitle && (
          <Text size='lg' fw={500} c='dimmed' ta='center'>
            {renderTitle}
          </Text>
        )}
        {renderDescription && (
          <Text size='sm' c='gray.6' ta='center'>
            {renderDescription}
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default EmptyState;
