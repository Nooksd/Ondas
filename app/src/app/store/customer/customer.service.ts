import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CustomerDTO, CustomerFilters, CustomersResponseDTO } from './customer.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = 'Customer';

  constructor(private http: ApiHttpClient) {}

  getCustomers(query?: CustomerFilters): Observable<CustomersResponseDTO> {
    const params: any = {};

    if (query?.page) params.Page = query.page;
    if (query?.size) params.Size = query.size;
    if (query?.q) params.q = query.q;

    return this.http
      .get<CustomersResponseDTO>(this.baseUrl, { params })
      .pipe(map((response: CustomersResponseDTO) => response));
  }

  getCustomer(id: number): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.baseUrl}/${id}`);
  }

  createCustomer(customer: CustomerDTO): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(this.baseUrl, customer);
  }

  updateCustomer(id: number, customer: CustomerDTO): Observable<CustomerDTO> {
    return this.http.put<CustomerDTO>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<CustomerDTO> {
    return this.http.delete<CustomerDTO>(`${this.baseUrl}/${id}`);
  }
}
