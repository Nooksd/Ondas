import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ChangePasswordDTO,
  RoleResponseDTO,
  UserDTO,
  UserFilters,
  UsersResponseDTO,
} from './user.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'User';

  constructor(private http: ApiHttpClient) {}

  getUsers(query?: UserFilters): Observable<UsersResponseDTO> {
    const params: any = {};

    if (query?.page) params.Page = query.page;
    if (query?.size) params.Size = query.size;
    if (query?.q) params.q = query.q;

    return this.http
      .get<UsersResponseDTO>(this.baseUrl, { params })
      .pipe(map((response: UsersResponseDTO) => response));
  }

  getUser(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.baseUrl, user);
  }

  updateUser(id: string, user: UserDTO): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<UserDTO> {
    return this.http.delete<UserDTO>(`${this.baseUrl}/${id}`);
  }

  changePassword(changePassword: ChangePasswordDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/change-password`, changePassword);
  }

  adminChangePassword(id: string, newPassword: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/change-password/${id}`, { newPassword });
  }

  revokeAccess(id: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/revoke/${id}`, null);
  }

  addRole(id: string, roleName: string): Observable<RoleResponseDTO> {
    return this.http.post<RoleResponseDTO>(`${this.baseUrl}/add-role/${id}`, { roleName });
  }

  removeRole(id: string, roleName: string): Observable<RoleResponseDTO> {
    return this.http.post<RoleResponseDTO>(`${this.baseUrl}/remove-role/${id}`, { roleName });
  }
}
