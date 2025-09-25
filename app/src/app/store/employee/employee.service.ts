import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EmployeeDTO, EmployeeFilters, EmployeesResponseDTO } from './employee.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly baseUrl = 'Employees';

  constructor(private http: ApiHttpClient) {}

  getEmployees(query?: EmployeeFilters): Observable<EmployeesResponseDTO> {
    const params: any = {};

    if (query?.page) params.Page = query.page;
    if (query?.size) params.Size = query.size;
    if (query?.q) params.q = query.q;
    params.IsActive = query?.isActive ?? true;

    return this.http
      .get<EmployeesResponseDTO>(this.baseUrl, { params })
      .pipe(map((response: EmployeesResponseDTO) => response));
  }

  getEmployee(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.baseUrl}/${id}`);
  }

  createEmployee(employee: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(this.baseUrl, employee);
  }

  updateEmployee(id: number, employee: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.baseUrl}/${id}`, employee);
  }

  activateEmployee(id: number): Observable<EmployeeDTO> {
    return this.http.patch<EmployeeDTO>(`${this.baseUrl}/activate/${id}`, null);
  }

  deactivateEmployee(id: number): Observable<EmployeeDTO> {
    return this.http.patch<EmployeeDTO>(`${this.baseUrl}/deactivate/${id}`, null);
  }

  deleteEmployee(id: number): Observable<EmployeeDTO> {
    return this.http.delete<EmployeeDTO>(`${this.baseUrl}/${id}`);
  }
}
