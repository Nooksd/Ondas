import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CustomerDTO, CustomerFilters } from './customer.state';
import { ApiHttpClient } from '../../core/api-http-client';

interface CustomerResponse {
  customers: CustomerDTO[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = 'Customer';

  constructor(private http: ApiHttpClient) {}

  getCustomers(query?: CustomerFilters): Observable<CustomerResponse> {
    const params: any = {};

    if (query?.page) params.Page = query.page;
    if (query?.size) params.Size = query.size;
    if (query?.q) params.q = query.q;

    return this.http.get<CustomerDTO[]>(this.baseUrl, { params }).pipe(
      map((customers: CustomerDTO[]) => ({
        customers,
        totalItems: customers.length,
        currentPage: query?.page || 1,
        pageSize: query?.size || 10,
      }))
    );
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
