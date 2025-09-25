import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, { users, pagination }) => ({
    ...state,
    loading: false,
    error: null,
    users,
    pagination,
  })),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    error: null,
    selectedUser: user,
  })),

  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    error: null,
    users: [...state.users, user],
  })),

  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    error: null,
    users: state.users.map((c) => (c.id === user.id ? user : c)),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    users: state.users.filter((c) => String(c?.id) !== String(id)),
    selectedUser: String(state.selectedUser?.id) === String(id) ? null : state.selectedUser,
  })),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.changePassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.changePasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(UserActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.adminChangePassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.adminChangePasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(UserActions.adminChangePasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.revokeAccess, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.revokeAccessSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(UserActions.revokeAccessFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.addRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.addRoleSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    error: null,
    users: state.users.map((u) =>
      u.id === response.user.id ? { ...u, roles: [...u.roles, response.roleName] } : u
    ),
    selectedUser:
      state.selectedUser && state.selectedUser.id === response.user.id
        ? { ...state.selectedUser, roles: [...state.selectedUser.roles, response.roleName] }
        : state.selectedUser,
  })),

  on(UserActions.addRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.removeRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.removeRoleSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    error: null,
    users: state.users.map((u) =>
      u.id === response.user.id
        ? { ...u, roles: u.roles.filter((r) => r !== response.roleName) }
        : u
    ),
    selectedUser:
      state.selectedUser && state.selectedUser.id === response.user.id
        ? {
            ...state.selectedUser,
            roles: state.selectedUser.roles.filter((r) => r !== response.roleName),
          }
        : state.selectedUser,
  })),

  on(UserActions.removeRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UserActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(UserActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
  }))
);
