import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, switchMap, catchError, filter, timeout } from 'rxjs/operators';
import { selectIsAuthenticated, selectAuthLoading, selectUser } from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return of(true);
        }

        this.store.dispatch(AuthActions.getMe());

        return this.store.select(selectAuthLoading).pipe(
          filter((loading) => !loading),
          take(1),

          switchMap(() => {
            return this.store.select(selectIsAuthenticated).pipe(
              take(1),
              map((isAuthenticated) => {
                if (!isAuthenticated) {
                  this.router.navigate(['/login']);
                  return false;
                }
                return true;
              })
            );
          }),
          timeout(10000),
          catchError((error) => {
            console.error('AuthGuard error:', error);
            this.router.navigate(['/login']);
            return of(false);
          })
        );
      })
    );
  }
}
