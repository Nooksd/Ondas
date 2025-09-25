import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');

export const selectEmployees = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.selectedEmployee
);

export const selectEmployeeLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.loading
);

export const selectEmployeeError = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.error
);

export const selectEmployeePaginationInfo = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.pagination
);

export const selectEmployeeById = (id: number) =>
  createSelector(selectEmployees, (employees) => employees.find((employee) => employee.id === id));
