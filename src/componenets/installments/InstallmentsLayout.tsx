import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import Footer from '../common/Footer/Footer';
import Header from '../../componenets/common/Header/Header';
import { Outlet } from 'react-router-dom';
import { fetchInstallments } from '../../features/installments/installmentsSlice';

const InstallmentsLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchInstallments());
  }, [dispatch]);

  return (
    <>
      <div className='min-h-[100dvh] flex flex-col bg-gray-200'>
        <Header />
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

export default InstallmentsLayout;
