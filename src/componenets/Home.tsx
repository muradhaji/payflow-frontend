import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { Button, Flex, Text, Title } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

import ResponsiveContainer from './common/ResponsiveContainer/ResponsiveContainer';

import utilStyles from '../styles/utils.module.css';
import { useThemeColors } from '../hooks/useThemeColors';

export default function Home() {
  const { t } = useTranslation();

  const { themedColor } = useThemeColors();

  return (
    <ResponsiveContainer
      flex
      align='center'
      justify='center'
      className={utilStyles.flexFill}
    >
      <Flex py='lg' direction='column' gap='lg' justify='center' align='center'>
        <Title
          order={1}
          size='h1'
          ta='center'
          c={themedColor('gray.9', 'gray.0')}
          fw={700}
        >
          <Trans
            i18nKey='components.home.intro.title'
            components={{ 1: <br /> }}
          />
        </Title>
        <Text
          size='md'
          ta='center'
          c={themedColor('gray.7', 'gray.3')}
          fw={700}
        >
          <Trans
            i18nKey='components.home.intro.description'
            components={{ 1: <br /> }}
          />
        </Text>

        <Flex justify='center' align='center' gap='md'>
          <Button
            color={themedColor('blue', 'blue.4')}
            component={Link}
            to='/register'
          >
            {t('buttons.getStarted.label')}
          </Button>
          <Button
            component='a'
            target='_blank'
            href='https://muradhajiyev.vercel.app/projects'
            variant='subtle'
            color={themedColor('blue', 'blue.4')}
            rightSection={<IconExternalLink size={20} />}
          >
            {t('buttons.otherProjects.label')}
          </Button>
        </Flex>
      </Flex>
    </ResponsiveContainer>
  );
}
