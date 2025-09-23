import { createReducer, on } from '@ngrx/store';
import { initialCustomerState } from './customer.state';
import * as CustomerActions from './customer.actions';

export const customerReducer = createReducer(
  initialCustomerState,

  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    CustomerActions.loadCustomersSuccess,
    (state, { customers, totalItems, currentPage, pageSize }) => ({
      ...state,
      loading: false,
      error: null,
      customers,
      totalItems,
      currentPage,
      pageSize,
    })
  ),

  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CustomerActions.loadCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.loadCustomerSuccess, (state, { customer }) => ({
    ...state,
    loading: false,
    error: null,
    selectedCustomer: customer,
  })),

  on(CustomerActions.loadCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.createCustomerSuccess, (state, { customer }) => ({
    ...state,
    loading: false,
    error: null,
    customers: [...state.customers, customer],
    totalItems: state.totalItems + 1,
  })),

  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CustomerActions.updateCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    loading: false,
    error: null,
    customers: state.customers.map((c) => (c.id === customer.id ? customer : c)),
    selectedCustomer:
      state.selectedCustomer?.id === customer.id ? customer : state.selectedCustomer,
  })),

  on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    customers: state.customers.filter((c) => c.id !== id),
    totalItems: state.totalItems - 1,
    selectedCustomer: state.selectedCustomer?.id === id ? null : state.selectedCustomer,
  })),

  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CustomerActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null,
  }))
);
