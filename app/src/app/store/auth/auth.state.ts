export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
};
