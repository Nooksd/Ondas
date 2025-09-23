import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDTO, User } from './team.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'Auth';

  constructor(private http: ApiHttpClient) {}

  login(credentials: LoginDTO): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials);
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/refresh-token`, {});
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }
}
