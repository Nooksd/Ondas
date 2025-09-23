import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './service.actions';
import { AuthService } from './service.service';
import { User } from './service.state';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(HotToastService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          this.toast.observe({
            loading: 'Realizando login...',
            success: 'Login realizado com sucesso!',
            error: 'Falha no login, verifique suas credenciais',
          }),
          map((user: User) => AuthActions.loginSuccess({ user })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Erro no login' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(() =>
        this.authService.refreshToken().pipe(
          map(() => AuthActions.refreshTokenSuccess()),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error.message || 'Erro ao renovar token' }))
          )
        )
      )
    )
  );

  refreshTokenFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  getMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getMe),
      mergeMap(() =>
        this.authService.getMe().pipe(
          map((user: User) => AuthActions.getMeSuccess({ user })),
          catchError((error) =>
            of(AuthActions.getMeFailure({ error: error.message || 'Erro ao buscar usuário' }))
          )
        )
      )
    )
  );

  getMeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getMeFailure),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.logoutFailure({ error: error.message || 'Erro no logout' }))
          )
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
