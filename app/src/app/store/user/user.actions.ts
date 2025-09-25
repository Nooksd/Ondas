import { createAction, props } from '@ngrx/store';
import {
  UserDTO,
  UserFilters,
  PaginationDTO,
  ChangePasswordDTO,
  RoleResponseDTO,
} from './user.state';

export const loadUsers = createAction('[User] Load Users', props<{ query?: UserFilters }>());
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: UserDTO[]; pagination: PaginationDTO }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

export const loadUser = createAction('[User] Load User', props<{ id: string }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: UserDTO }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

export const createUser = createAction('[User] Create User', props<{ user: UserDTO }>());
export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ user: UserDTO }>()
);
export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string; user: UserDTO }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: UserDTO }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
);

export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction(
  '[User] Delete User Success',
  props<{ id: string }>()
);
export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: string }>()
);

export const changePassword = createAction(
  '[User] Change Password',
  props<{ changePassword: ChangePasswordDTO }>()
);
export const changePasswordSuccess = createAction('[User] Change Password Success');
export const changePasswordFailure = createAction(
  '[User] Change Password Failure',
  props<{ error: string }>()
);

export const adminChangePassword = createAction(
  '[User] Admin Change Password',
  props<{ id: string; newPassword: string }>()
);
export const adminChangePasswordSuccess = createAction('[User] Admin Change Password Success');
export const adminChangePasswordFailure = createAction(
  '[User] Admin Change Password Failure',
  props<{ error: string }>()
);

export const revokeAccess = createAction('[User] Revoke Access', props<{ id: string }>());
export const revokeAccessSuccess = createAction('[User] Revoke Access Success');
export const revokeAccessFailure = createAction(
  '[User] Revoke Access Failure',
  props<{ error: string }>()
);

export const addRole = createAction('[User] Add Role', props<{ id: string; roleName: string }>());
export const addRoleSuccess = createAction(
  '[User] Add Role Success',
  props<{ response: RoleResponseDTO }>()
);
export const addRoleFailure = createAction('[User] Add Role Failure', props<{ error: string }>());

export const removeRole = createAction(
  '[User] Remove Role',
  props<{ id: string; roleName: string }>()
);
export const removeRoleSuccess = createAction(
  '[User] Remove Role Success',
  props<{ response: RoleResponseDTO }>()
);
export const removeRoleFailure = createAction(
  '[User] Remove Role Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[User] Clear Error');

export const clearSelectedUser = createAction('[User] Clear Selected User');
