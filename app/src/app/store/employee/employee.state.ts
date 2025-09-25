export interface EmployeeDTO {
  id?: number;
  name: string;
  role: string;
  cpf: string;
  salary: number;
  isActive: boolean;
}

export interface PaginationDTO {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface EmployeesResponseDTO {
  employees: EmployeeDTO[];
  metadata: PaginationDTO;
}

export interface EmployeeFilters {
  page?: number;
  size?: number;
  q?: string;
  isActive?: boolean;
}

export interface EmployeeState {
  employees: EmployeeDTO[];
  selectedEmployee: EmployeeDTO | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationDTO | null;
  filters: EmployeeFilters;
}

export const initialEmployeeState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    size: 10,
    q: '',
  },
};
