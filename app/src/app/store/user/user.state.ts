export const Roles: String[] = ['Viewer', 'Editor', 'Admin'];

export interface UserDTO {
  id?: string;
  userName: string;
  email: string;
  password?: string;
  roles: string[];
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface PaginationDTO {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface UsersResponseDTO {
  users: UserDTO[];
  metadata: PaginationDTO;
}

export interface RoleResponseDTO {
  user: UserDTO;
  roleName: string;
}

export interface UserFilters {
  page?: number;
  size?: number;
  q?: string;
}

export interface UserState {
  users: UserDTO[];
  selectedUser: UserDTO | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationDTO | null;
  filters: UserFilters;
}

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    size: 10,
    q: '',
  },
};
