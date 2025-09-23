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
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  filters: CustomerFilters;
}

export const initialCustomerState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  totalItems: 0,
  filters: {
    page: 1,
    size: 10,
    q: '',
  },
};
