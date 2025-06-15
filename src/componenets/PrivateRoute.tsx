import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token } = useAppSelector((state) => state.auth);

  return token ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute;
