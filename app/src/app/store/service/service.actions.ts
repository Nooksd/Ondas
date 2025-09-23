import { createAction, props } from '@ngrx/store';
import { LoginDTO, User } from './service.state';

export const login = createAction('[Auth] Login', props<{ credentials: LoginDTO }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success');
export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const getMe = createAction('[Auth] Get Me');
export const getMeSuccess = createAction('[Auth] Get Me Success', props<{ user: User }>());
export const getMeFailure = createAction('[Auth] Get Me Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

export const clearError = createAction('[Auth] Clear Error');
