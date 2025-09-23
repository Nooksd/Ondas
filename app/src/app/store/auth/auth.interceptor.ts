import { inject, Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  throwError,
  BehaviorSubject,
  filter,
  take,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<boolean | null>(null);

  injector = inject(Injector);
  store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqWithCreds = req.clone({ withCredentials: true });

    return next.handle(reqWithCreds).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthEndpoint =
          req.url.includes('refresh-token') ||
          req.url.includes('login') ||
          req.url.includes('logout');

        if (error.status === 401 && !isAuthEndpoint) {
          return this.handle401Error(reqWithCreds, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService) as AuthService;

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      this.store.dispatch(AuthActions.refreshToken());

      return authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          this.refreshSubject.next(true);

          const cloned = req.clone({ withCredentials: true });
          return next.handle(cloned);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.refreshSubject.next(false);
          this.store.dispatch(AuthActions.refreshTokenFailure({ error: err }));
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshSubject.pipe(
        filter((v) => v !== null),
        take(1),
        switchMap((ok) => {
          if (ok) {
            const cloned = req.clone({ withCredentials: true });
            return next.handle(cloned);
          } else {
            return throwError(() => new Error('Refresh token failed'));
          }
        })
      );
    }
  }
}
