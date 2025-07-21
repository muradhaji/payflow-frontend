import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Flex, Text, Title } from '@mantine/core';
import ResponsiveContainer from './common/ResponsiveContainer/ResponsiveContainer';
import utilStyles from '../styles/utils.module.css';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer
      flex
      align='center'
      justify='center'
      className={utilStyles.flexFill}
    >
      <Flex py='lg' direction='column' gap='lg' justify='center' align='center'>
        <Title order={1} size='h1' ta='center' c='gray.9' fw={700}>
          <Trans i18nKey='home.intro.heading' components={{ 1: <br /> }} />
        </Title>
        <Text size='md' ta='center' c='gray.7' fw={700}>
          <Trans i18nKey='home.intro.paragraph' components={{ 1: <br /> }} />
        </Text>

        <Flex justify='center' align='center' gap='md'>
          <Button component={Link} to='/register'>
            {t('home.buttons.getStarted')}
          </Button>
          <Button
            component='a'
            target='_blank'
            href='https://muradhajiyev.vercel.app/projects'
            variant='subtle'
            rightSection={<ArrowRight size={14} />}
          >
            {t('home.buttons.otherProjects')}
          </Button>
        </Flex>
      </Flex>
    </ResponsiveContainer>
  );
}
