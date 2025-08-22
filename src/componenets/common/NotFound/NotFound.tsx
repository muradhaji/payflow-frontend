import { Link } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';

import { Illustration } from './Illustration';

import classes from './NotFound.module.css';
import { useThemeColors } from '../../../hooks/useThemeColors';

const NotFound = () => {
  const { t } = useTranslation();
  const { themedColor } = useThemeColors();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <Stack align='center' gap='xl' className={classes.content}>
          <Title ta='center' fw={500} className={classes.title}>
            {t('components.notFound.title')}
          </Title>
          <Text
            c='dimmed'
            size='lg'
            ta='center'
            className={classes.description}
          >
            <Trans
              i18nKey='components.notFound.description'
              components={{ 1: <br /> }}
            />
          </Text>
          <Group justify='center'>
            <Button
              color={themedColor('blue', 'blue.4')}
              component={Link}
              to='/'
              size='md'
            >
              {t('components.notFound.button')}
            </Button>
          </Group>
        </Stack>
      </div>
    </Container>
  );
};

export default NotFound;
