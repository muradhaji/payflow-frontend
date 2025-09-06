export interface AuthResponse {
  _id: string;
  username: string;
  token: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthSliceState {
  user: null | { _id: string; username: string };
  token: string | null;
  loading: boolean;
  error: string | null;
}
