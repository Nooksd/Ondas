import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TeamDTO, TeamFilters, TeamsResponseDTO } from './team.state';
import { ApiHttpClient } from '../../core/api-http-client';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly baseUrl = 'Teams';

  constructor(private http: ApiHttpClient) {}

  getTeams(query?: TeamFilters): Observable<TeamsResponseDTO> {
    const params: any = {};

    if (query?.page) params.Page = query.page;
    if (query?.size) params.Size = query.size;
    if (query?.q) params.q = query.q;
    params.IsActive = query?.isActive ?? true;

    return this.http
      .get<TeamsResponseDTO>(this.baseUrl, { params })
      .pipe(map((response: TeamsResponseDTO) => response));
  }

  getTeam(id: number): Observable<TeamDTO> {
    return this.http.get<TeamDTO>(`${this.baseUrl}/${id}`);
  }

  createTeam(team: TeamDTO): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(this.baseUrl, team);
  }

  addTeamMember(teamId: number, employeeId: number): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(`${this.baseUrl}/${teamId}/add-member/${employeeId}`, null);
  }

  removeTeamMember(teamId: number, employeeId: number): Observable<TeamDTO> {
    return this.http.post<TeamDTO>(`${this.baseUrl}/${teamId}/remove-member/${employeeId}`, null);
  }

  updateTeam(id: number, team: TeamDTO): Observable<TeamDTO> {
    return this.http.put<TeamDTO>(`${this.baseUrl}/${id}`, team);
  }

  activateTeam(id: number): Observable<TeamDTO> {
    return this.http.patch<TeamDTO>(`${this.baseUrl}/activate/${id}`, null);
  }

  deactivateTeam(id: number): Observable<TeamDTO> {
    return this.http.patch<TeamDTO>(`${this.baseUrl}/deactivate/${id}`, null);
  }

  deleteTeam(id: number): Observable<TeamDTO> {
    return this.http.delete<TeamDTO>(`${this.baseUrl}/${id}`);
  }
}
