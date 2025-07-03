import { Link } from 'react-router-dom';
import Header from './Header';
import { Trans, useTranslation } from 'react-i18next';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <section className='home_page min-h-[100dvh] bg-gray-200 flex flex-col'>
      <Header
        rightElement={
          isAuthenticated ? (
            <Link
              to='/dashboard'
              className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            >
              {user?.username}
            </Link>
          ) : (
            <Link
              to='/login'
              className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            >
              {t('home.loginButton')}
            </Link>
          )
        }
      />
      <main id='parent' className='px-3 py-12 flex-1 flex'>
        <div id='child' className='container mx-auto max-w-2xl'>
          <div className='flex flex-col gap-6 justify-center h-full'>
            <h1 className='text-center text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl'>
              <Trans i18nKey='home.headingText' components={{ 1: <br /> }} />
            </h1>
            <p className=' text-center text-md font-medium text-pretty text-gray-500 sm:text-lg/6'>
              <Trans i18nKey='home.paragraphText' components={{ 1: <br /> }} />
            </p>
            <div className='flex gap-2 items-center justify-center'>
              <Link
                to='/register'
                className='rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
              >
                {t('home.getStartedButton')}
              </Link>
              <Link
                to='https://muradhajiyev.vercel.app/projects'
                className='text-sm/6 font-semibold text-gray-900 flex gap-2'
              >
                {t('home.viewOtherProjectsButton')}
                <span aria-hidden='true'>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
