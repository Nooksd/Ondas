export interface AddressDTO {
  postalCode: string;
  region: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  complement?: string;
}

export interface CustomerDTO {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: AddressDTO;
}

export interface PaginationDTO {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CustomersResponseDTO {
  customers: CustomerDTO[];
  metadata: PaginationDTO;
}

export interface CustomerFilters {
  page?: number;
  size?: number;
  q?: string;
}

export interface CustomerState {
  customers: CustomerDTO[];
  selectedCustomer: CustomerDTO | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationDTO | null;
  filters: CustomerFilters;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    size: 10,
    q: '',
  },
};
