import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigDTO } from './config.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly baseUrl = 'Config';

  constructor(private http: ApiHttpClient) {}

  getConfig(): Observable<ConfigDTO> {
    return this.http.get<ConfigDTO>(`${this.baseUrl}`);
  }

  updateConfig(config: ConfigDTO): Observable<ConfigDTO> {
    return this.http.put<ConfigDTO>(`${this.baseUrl}`, config);
  }

  testConfig(email: string): Observable<ConfigDTO> {
    return this.http.post<ConfigDTO>(`${this.baseUrl}/test/${email}`, null);
  }
}
