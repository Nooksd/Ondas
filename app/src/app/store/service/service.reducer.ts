import { createReducer, on } from '@ngrx/store';
import { initialServiceState } from './service.state';
import * as ServiceActions from './service.actions';

export const serviceReducer = createReducer(
  initialServiceState,

  on(ServiceActions.loadServices, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.loadServicesSuccess, (state, { services, pagination }) => ({
    ...state,
    loading: false,
    error: null,
    services,
    pagination,
  })),

  on(ServiceActions.loadServicesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.loadService, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.loadServiceSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    error: null,
    selectedService: service,
  })),

  on(ServiceActions.loadServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.createService, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.createServiceSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    error: null,
    services: [...state.services, service],
  })),

  on(ServiceActions.createServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.updateService, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.updateServiceSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    error: null,
    services: state.services.map((c) => (c.id === service.id ? service : c)),
    selectedService: state.selectedService?.id === service.id ? service : state.selectedService,
  })),

  on(ServiceActions.updateServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.changeServiceStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.changeServiceStatusSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    error: null,
    services: state.services.map((c) => (c.id === service.id ? service : c)),
    selectedService: state.selectedService?.id === service.id ? service : state.selectedService,
  })),

  on(ServiceActions.changeServiceStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.deleteService, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ServiceActions.deleteServiceSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    services: state.services.filter((c) => c.id !== id),
    selectedService: state.selectedService?.id === id ? null : state.selectedService,
  })),

  on(ServiceActions.deleteServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ServiceActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(ServiceActions.clearSelectedService, (state) => ({
    ...state,
    selectedService: null,
  }))
);
