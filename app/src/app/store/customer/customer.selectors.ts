import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customers
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.selectedCustomer
);

export const selectCustomerLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectCustomerPaginationInfo = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pagination
);

export const selectCustomerById = (id: number) =>
  createSelector(selectCustomers, (customers) => customers.find((customer) => customer.id === id));
