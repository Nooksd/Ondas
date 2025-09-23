import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './user.state';
import * as AuthActions from './user.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    isAuthenticated: true,
    error: null,
    user,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.refreshTokenSuccess, (state) => ({
    ...state,
    loading: false,
    isAuthenticated: true,
    error: null,
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
  })),

  on(AuthActions.getMe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.getMeSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    isAuthenticated: true,
    error: null,
    user,
  })),

  on(AuthActions.getMeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
