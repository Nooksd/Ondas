export interface ChangeStatusDTO {
  newStatus: number;
  paymentDate: Date | null;
}

export enum ServiceStatus {
  Agendado = 1,
  EmAndamento = 2,
  AguardandoPagamento = 3,
  AtrasoNoPagamento = 4,
  Concluido = 5,
  Cancelado = 6,
}

export interface ServiceDTO {
  id?: number;
  customerId: number;
  teamId: number;
  teamName: string | null;
  customerName: string | null;
  price: number;
  serviceDate: Date;
  serviceDuration: number;
  paymentDueDate: Date;
  description: string | null;
  status: ServiceStatus;
  paymentDate: Date | null;
}

export interface PaginationDTO {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ServicesResponseDTO {
  services: ServiceDTO[];
  metadata: PaginationDTO;
}

export interface ServiceFilters {
  customerId: number | null;
  teamId: number | null;
  initialDate: Date;
  finalDate: Date;
}

export interface ServiceState {
  services: ServiceDTO[];
  selectedService: ServiceDTO | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationDTO | null;
  filters: ServiceFilters;
}

export const initialServiceState: ServiceState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    customerId: null,
    teamId: null,
    initialDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    finalDate: new Date(),
  },
};
