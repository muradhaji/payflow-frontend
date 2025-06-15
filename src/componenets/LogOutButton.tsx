import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function LogOutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button
      onClick={handleLogout}
      className='rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
