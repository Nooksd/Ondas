import { createAction, props } from '@ngrx/store';
import { EmployeeDTO, EmployeeFilters, PaginationDTO } from './employee.state';

export const loadEmployees = createAction(
  '[Employee] Load Employees',
  props<{ query?: EmployeeFilters }>()
);
export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: EmployeeDTO[]; pagination: PaginationDTO }>()
);
export const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ error: string }>()
);

export const loadEmployee = createAction('[Employee] Load Employee', props<{ id: number }>());
export const loadEmployeeSuccess = createAction(
  '[Employee] Load Employee Success',
  props<{ employee: EmployeeDTO }>()
);
export const loadEmployeeFailure = createAction(
  '[Employee] Load Employee Failure',
  props<{ error: string }>()
);

export const createEmployee = createAction(
  '[Employee] Create Employee',
  props<{ employee: EmployeeDTO }>()
);
export const createEmployeeSuccess = createAction(
  '[Employee] Create Employee Success',
  props<{ employee: EmployeeDTO }>()
);
export const createEmployeeFailure = createAction(
  '[Employee] Create Employee Failure',
  props<{ error: string }>()
);

export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ id: number; employee: EmployeeDTO }>()
);
export const updateEmployeeSuccess = createAction(
  '[Employee] Update Employee Success',
  props<{ employee: EmployeeDTO }>()
);
export const updateEmployeeFailure = createAction(
  '[Employee] Update Employee Failure',
  props<{ error: string }>()
);

export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ id: number }>());
export const deleteEmployeeSuccess = createAction(
  '[Employee] Delete Employee Success',
  props<{ id: number }>()
);
export const deleteEmployeeFailure = createAction(
  '[Employee] Delete Employee Failure',
  props<{ error: string }>()
);

export const activateEmployee = createAction(
  '[Employee] Activate Employee',
  props<{ id: number }>()
);
export const activateEmployeeSuccess = createAction(
  '[Employee] Activate Employee Success',
  props<{ employee: EmployeeDTO }>()
);
export const activateEmployeeFailure = createAction(
  '[Employee] Activate Employee Failure',
  props<{ error: string }>()
);

export const deactivateEmployee = createAction(
  '[Employee] Deactivate Employee',
  props<{ id: number }>()
);
export const deactivateEmployeeSuccess = createAction(
  '[Employee] Deactivate Employee Success',
  props<{ employee: EmployeeDTO }>()
);
export const deactivateEmployeeFailure = createAction(
  '[Employee] Deactivate Employee Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Employee] Clear Error');

export const clearSelectedEmployee = createAction('[Employee] Clear Selected Employee');
