import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './team.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);
