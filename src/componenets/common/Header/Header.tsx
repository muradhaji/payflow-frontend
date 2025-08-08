import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../../hooks/useAuth';
import UserMenu from '../UserMenu/UserMenu';
import { Button, Card, Flex, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ResponsiveContainer from '../ResponsiveContainer/ResponsiveContainer';

function Header() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <Card bg='gray.1' p='sm' shadow='lg'>
      <ResponsiveContainer>
        <Flex justify='space-between' align='center'>
          <Link to='/'>
            <Title order={2} size='h2' fw={700}>
              <Text c='blue.6' span inherit>
                Pay
              </Text>
              <Text c='gray.9' span inherit>
                Flow
              </Text>
            </Title>
          </Link>

          <Flex gap='xs'>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <UserMenu />
            ) : ['/login'].includes(pathname) ? (
              <Button component={Link} to='/register' size='xs'>
                {t('buttons.signup.label')}
              </Button>
            ) : (
              <Button component={Link} to='/login' size='xs'>
                {t('buttons.login.label')}
              </Button>
            )}
          </Flex>
        </Flex>
      </ResponsiveContainer>
    </Card>
  );
}

export default Header;
