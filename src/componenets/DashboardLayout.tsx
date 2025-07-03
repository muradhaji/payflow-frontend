import Footer from './Footer';
import Header from './Header';
import LogOutButton from './LogOutButton';
import FullPageSpinner from './FullPageSpinner';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useEffect } from 'react';
import { fetchInstallments } from '../features/installments/installmentsSlice';

const DashboardLayout = () => {
  const dispatch = useAppDispatch();

  const {
    fetchInstallments: { loading },
  } = useAppSelector((state) => state.installments);

  useEffect(() => {
    dispatch(fetchInstallments());
  }, [dispatch]);

  return loading ? (
    <FullPageSpinner />
  ) : (
    <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
      <Header rightElement={<LogOutButton />} />
      <div className='flex-1 px-3 py-6'>
        <div className='container mx-auto'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
