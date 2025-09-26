import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChangeStatusDTO, ServiceDTO, ServiceFilters, ServicesResponseDTO } from './service.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly baseUrl = 'Service';

  constructor(private http: ApiHttpClient) {}

  getServices(query?: ServiceFilters): Observable<ServicesResponseDTO> {
    const params: any = {};

    if (query?.customerId) params.customerId = query.customerId;
    if (query?.teamId) params.teamId = query.teamId;
    params.initialDate = query?.initialDate.toISOString().split('T')[0];
    params.finalDate = query?.finalDate.toISOString().split('T')[0];

    return this.http
      .get<ServicesResponseDTO>(this.baseUrl, { params })
      .pipe(map((response: ServicesResponseDTO) => response));
  }

  getService(id: number): Observable<ServiceDTO> {
    return this.http.get<ServiceDTO>(`${this.baseUrl}/${id}`);
  }

  createService(service: ServiceDTO): Observable<ServiceDTO> {
    return this.http.post<ServiceDTO>(this.baseUrl, service);
  }

  updateService(id: number, service: ServiceDTO): Observable<ServiceDTO> {
    return this.http.put<ServiceDTO>(`${this.baseUrl}/${id}`, service);
  }

  changeStatusService(id: number, newStatus: ChangeStatusDTO): Observable<ServiceDTO> {
    return this.http.put<ServiceDTO>(`${this.baseUrl}/update-status/${id}`, newStatus);
  }

  deleteService(id: number): Observable<ServiceDTO> {
    return this.http.delete<ServiceDTO>(`${this.baseUrl}/${id}`);
  }
}
