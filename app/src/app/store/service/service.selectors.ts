import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ServiceState } from './service.state';

export const selectServiceState = createFeatureSelector<ServiceState>('service');

export const selectServices = createSelector(
  selectServiceState,
  (state: ServiceState) => state.services
);

export const selectSelectedService = createSelector(
  selectServiceState,
  (state: ServiceState) => state.selectedService
);

export const selectServiceLoading = createSelector(
  selectServiceState,
  (state: ServiceState) => state.loading
);

export const selectServiceError = createSelector(
  selectServiceState,
  (state: ServiceState) => state.error
);
