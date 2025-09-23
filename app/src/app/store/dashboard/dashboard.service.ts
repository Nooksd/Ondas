import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStatsDTO, DashboardQuery } from './dashboard.state';
import { ApiHttpClient } from '../../core/api-http-client';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = 'Dashboard';

  constructor(private http: ApiHttpClient) {}

  getDashboardStats(query: DashboardQuery): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(
      `${this.baseUrl}/stats?dataInicial=${query.dataInicial}&dataFinal=${query.dataFinal}`
    );
  }
}
