import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiHttpClient {
  private readonly baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  private fullUrl(url: string): string {
    return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }

  get<T>(url: string, options: { params?: HttpParams; headers?: HttpHeaders } = {}): Observable<T> {
    return this.http.get<T>(this.fullUrl(url), { ...options, withCredentials: true });
  }

  post<T>(
    url: string,
    body: any,
    options: { params?: HttpParams; headers?: HttpHeaders } = {}
  ): Observable<T> {
    return this.http.post<T>(this.fullUrl(url), body, { ...options, withCredentials: true });
  }

  put<T>(
    url: string,
    body: any,
    options: { params?: HttpParams; headers?: HttpHeaders } = {}
  ): Observable<T> {
    return this.http.put<T>(this.fullUrl(url), body, { ...options, withCredentials: true });
  }

  patch<T>(
    url: string,
    body: any,
    options: { params?: HttpParams; headers?: HttpHeaders } = {}
  ): Observable<T> {
    return this.http.patch<T>(this.fullUrl(url), body, { ...options, withCredentials: true });
  }

  delete<T>(
    url: string,
    options: { params?: HttpParams; headers?: HttpHeaders } = {}
  ): Observable<T> {
    return this.http.delete<T>(this.fullUrl(url), { ...options, withCredentials: true });
  }
}
