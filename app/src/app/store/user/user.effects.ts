import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { UserService } from './user.service';
import { RoleResponseDTO, UserDTO } from './user.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private toast = inject(HotToastService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap((action) =>
        this.userService.getUsers(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando usuários...',
            error: 'Erro ao carregar usuários',
          }),
          map((response) => {
            return UserActions.loadUsersSuccess({
              users: response.users,
              pagination: response.metadata,
            });
          }),
          catchError((error) =>
            of(
              UserActions.loadUsersFailure({
                error: error.message || 'Erro ao carregar usuários',
              })
            )
          )
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap((action) =>
        this.userService.getUser(action.id).pipe(
          this.toast.observe({
            loading: 'Buscando usuário...',
            success: 'Usuário carregado com sucesso!',
            error: 'Erro ao carregar usuário',
          }),
          map((user: UserDTO) => UserActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.loadUserFailure({
                error: error.message || 'Erro ao carregar usuário',
              })
            )
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap((action) =>
        this.userService.createUser(action.user).pipe(
          this.toast.observe({
            loading: 'Criando usuário...',
            success: 'Usuário criado com sucesso!',
            error: 'Erro ao criar usuário',
          }),
          map((user: UserDTO) => UserActions.createUserSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.createUserFailure({
                error: error.message || 'Erro ao criar usuário',
              })
            )
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.id, action.user).pipe(
          this.toast.observe({
            loading: 'Atualizando usuário...',
            success: 'Usuário atualizado com sucesso!',
            error: 'Erro ao atualizar usuário',
          }),
          map((user: UserDTO) => UserActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(
              UserActions.updateUserFailure({
                error: error.message || 'Erro ao atualizar usuário',
              })
            )
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) =>
        this.userService.deleteUser(action.id).pipe(
          this.toast.observe({
            loading: 'Excluindo usuário...',
            success: 'Usuário excluído com sucesso!',
            error: 'Erro ao excluir usuário',
          }),
          map(() => UserActions.deleteUserSuccess({ id: action.id })),
          catchError((error) =>
            of(
              UserActions.deleteUserFailure({
                error: error.message || 'Erro ao excluir usuário',
              })
            )
          )
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.changePassword),
      mergeMap((action) =>
        this.userService.changePassword(action.changePassword).pipe(
          this.toast.observe({
            loading: 'Alterando senha...',
            success: 'Senha alterada com sucesso!',
            error: 'Erro ao alterar senha',
          }),
          map(() => UserActions.changePasswordSuccess()),
          catchError((error) =>
            of(
              UserActions.changePasswordFailure({
                error: error.message || 'Erro ao alterar senha',
              })
            )
          )
        )
      )
    )
  );

  adminChangePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.adminChangePassword),
      mergeMap((action) =>
        this.userService.adminChangePassword(action.id, action.newPassword).pipe(
          this.toast.observe({
            loading: 'Alterando senha...',
            success: 'Senha alterada com sucesso!',
            error: 'Erro ao alterar senha',
          }),
          map(() => UserActions.adminChangePasswordSuccess()),
          catchError((error) =>
            of(
              UserActions.adminChangePasswordFailure({
                error: error.message || 'Erro ao alterar senha',
              })
            )
          )
        )
      )
    )
  );

  revokeAccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.revokeAccess),
      mergeMap((action) =>
        this.userService.revokeAccess(action.id).pipe(
          this.toast.observe({
            loading: 'Revogando acesso...',
            success: 'Acesso revogado com sucesso!',
            error: 'Erro ao revogar acesso',
          }),
          map(() => UserActions.revokeAccessSuccess()),
          catchError((error) =>
            of(
              UserActions.revokeAccessFailure({
                error: error.message || 'Erro ao revogar acesso',
              })
            )
          )
        )
      )
    )
  );

  addRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addRole),
      mergeMap((action) =>
        this.userService.addRole(action.id, action.roleName).pipe(
          this.toast.observe({
            loading: 'Adicionando role...',
            success: 'Role adicionada com sucesso!',
            error: 'Erro ao adicionar role',
          }),
          map((response: RoleResponseDTO) => UserActions.addRoleSuccess({ response })),
          catchError((error) =>
            of(
              UserActions.addRoleFailure({
                error: error.message || 'Erro ao adicionar role',
              })
            )
          )
        )
      )
    )
  );

  removeRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removeRole),
      mergeMap((action) =>
        this.userService.removeRole(action.id, action.roleName).pipe(
          this.toast.observe({
            loading: 'Removendo role...',
            success: 'Role removida com sucesso!',
            error: 'Erro ao remover role',
          }),
          map((response: RoleResponseDTO) => UserActions.removeRoleSuccess({ response })),
          catchError((error) =>
            of(
              UserActions.removeRoleFailure({
                error: error.message || 'Erro ao remover role',
              })
            )
          )
        )
      )
    )
  );
}
