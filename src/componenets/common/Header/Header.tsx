import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useAuth } from '../../../hooks/useAuth';
import UserMenu from '../UserMenu/UserMenu';
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function Header() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <header className='bg-gray-100 p-3 shadow-xl'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text_logo text-2xl font-bold pointer'>
          <span className='text-blue-600'>Pay</span>
          <span>Flow</span>
        </Link>
        <div className='flex gap-2'>
          <LanguageSwitcher />

          {isAuthenticated ? (
            <UserMenu />
          ) : ['/login'].includes(pathname) ? (
            <Button component={Link} to='/register' size='xs'>
              {t('auth.login.header.buttons.signup')}
            </Button>
          ) : (
            <Button component={Link} to='/login' size='xs'>
              {t('auth.signup.header.buttons.login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
