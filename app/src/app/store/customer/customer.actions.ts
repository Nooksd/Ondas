import { createAction, props } from '@ngrx/store';
import { CustomerDTO, CustomerFilters } from './customer.state';

export const loadCustomers = createAction(
  '[Customer] Load Customers',
  props<{ query?: CustomerFilters }>()
);
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: CustomerDTO[]; totalItems: number; currentPage: number; pageSize: number }>()
);
export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

export const loadCustomer = createAction('[Customer] Load Customer', props<{ id: number }>());
export const loadCustomerSuccess = createAction(
  '[Customer] Load Customer Success',
  props<{ customer: CustomerDTO }>()
);
export const loadCustomerFailure = createAction(
  '[Customer] Load Customer Failure',
  props<{ error: string }>()
);

export const createCustomer = createAction(
  '[Customer] Create Customer',
  props<{ customer: CustomerDTO }>()
);
export const createCustomerSuccess = createAction(
  '[Customer] Create Customer Success',
  props<{ customer: CustomerDTO }>()
);
export const createCustomerFailure = createAction(
  '[Customer] Create Customer Failure',
  props<{ error: string }>()
);

export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ id: number; customer: CustomerDTO }>()
);
export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success',
  props<{ customer: CustomerDTO }>()
);
export const updateCustomerFailure = createAction(
  '[Customer] Update Customer Failure',
  props<{ error: string }>()
);

export const deleteCustomer = createAction('[Customer] Delete Customer', props<{ id: number }>());
export const deleteCustomerSuccess = createAction(
  '[Customer] Delete Customer Success',
  props<{ id: number }>()
);
export const deleteCustomerFailure = createAction(
  '[Customer] Delete Customer Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Customer] Clear Error');

export const clearSelectedCustomer = createAction('[Customer] Clear Selected Customer');
