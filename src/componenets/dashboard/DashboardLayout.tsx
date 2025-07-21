import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { useEffect } from 'react';
import { fetchInstallments } from '../../features/installments/installmentsSlice';
import ResponsiveContainer from '../common/ResponsiveContainer/ResponsiveContainer';

const DashboardLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchInstallments());
  }, [dispatch]);

  return (
    <ResponsiveContainer>
      <Outlet />
    </ResponsiveContainer>
  );
};

export default DashboardLayout;
