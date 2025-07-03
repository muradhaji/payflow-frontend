import { useAppSelector } from '../app/hooks';

export function useAuth() {
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);

  return { isAuthenticated, user, token };
}
