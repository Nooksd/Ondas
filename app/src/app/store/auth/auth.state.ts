export interface LoginDTO {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

export const initialAuthState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
};
