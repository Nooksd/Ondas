import { EmployeeDTO } from '../employee/employee.state';

export interface TeamMemberDTO {
  employeeId: number;
  employee: EmployeeDTO | null;
}

export interface TeamDTO {
  id?: number;
  name: string;
  isActive: boolean;
  teamMembers: TeamMemberDTO[];
}

export interface PaginationDTO {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TeamsResponseDTO {
  teams: TeamDTO[];
  metadata: PaginationDTO;
}

export interface TeamFilters {
  page?: number;
  size?: number;
  q?: string;
  isActive?: boolean;
}

export interface TeamState {
  teams: TeamDTO[];
  selectedTeam: TeamDTO | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationDTO | null;
  filters: TeamFilters;
}

export const initialTeamState: TeamState = {
  teams: [],
  selectedTeam: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    size: 10,
    q: '',
  },
};
