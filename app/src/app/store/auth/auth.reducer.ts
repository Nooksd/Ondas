import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    loading: false,
    isAuthenticated: true,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
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
    tokens: null,
  })),

  on(AuthActions.checkAuth, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.checkAuthSuccess, (state, { isAuthenticated }) => ({
    ...state,
    loading: false,
    isAuthenticated,
    error: null,
  })),

  on(AuthActions.checkAuthFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
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
