import Header from './Header';
import LogOutButton from './LogOutButton';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header rightElement={<LogOutButton />} />
      <div className='px-3 py-12'>
        <div className='container mx-auto'>
          <h1>{t('dashboard')}</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
