import { createAction, props } from '@ngrx/store';
import { LoginDTO } from './auth.state';

export const login = createAction('[Auth] Login', props<{ credentials: LoginDTO }>());
export const loginSuccess = createAction('[Auth] Login Success');
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success');
export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const checkAuth = createAction('[Auth] Check Auth');
export const checkAuthSuccess = createAction(
  '[Auth] Check Auth Success',
  props<{ isAuthenticated: boolean }>()
);
export const checkAuthFailure = createAction('[Auth] Check Auth Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

export const clearError = createAction('[Auth] Clear Error');
