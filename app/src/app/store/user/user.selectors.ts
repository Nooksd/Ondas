import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(selectUserState, (state: UserState) => state.users);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state: UserState) => state.selectedUser
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error);

export const selectUserPaginationInfo = createSelector(
  selectUserState,
  (state: UserState) => state.pagination
);

export const selectUserById = (id: string) =>
  createSelector(selectUsers, (users) => users.find((user) => user.id === id));
