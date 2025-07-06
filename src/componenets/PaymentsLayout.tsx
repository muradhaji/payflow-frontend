import Footer from './Footer';
import Header from './Header';
import LogOutButton from './LogOutButton';
import { Outlet } from 'react-router-dom';

const PaymentsLayout = () => {
  return (
    <>
      <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
        <Header rightElement={<LogOutButton />} />
        <div className='flex-1 px-3 py-6'>
          <div className='container mx-auto'>
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PaymentsLayout;
