import { Link } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Button, Container, Group, Text, Title } from '@mantine/core';

import { Illustration } from './Illustration';

import classes from './NotFound.module.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>
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
            <Button component={Link} to='/' size='md'>
              {t('components.notFound.button')}
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
