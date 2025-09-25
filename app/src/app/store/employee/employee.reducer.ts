import { createReducer, on } from '@ngrx/store';
import { initialEmployeeState } from './employee.state';
import * as EmployeeActions from './employee.actions';

export const employeeReducer = createReducer(
  initialEmployeeState,

  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.loadEmployeesSuccess, (state, { employees, pagination }) => ({
    ...state,
    loading: false,
    error: null,
    employees,
    pagination,
  })),

  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.loadEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.loadEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    error: null,
    selectedEmployee: employee,
  })),

  on(EmployeeActions.loadEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.createEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    error: null,
    employees: [...state.employees, employee],
  })),

  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    error: null,
    employees: state.employees.map((c) => (c.id === employee.id ? employee : c)),
    selectedEmployee:
      state.selectedEmployee?.id === employee.id ? employee : state.selectedEmployee,
  })),

  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.activateEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.activateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    error: null,
    employees: state.employees.map((c) => (c.id === employee.id ? employee : c)),
    selectedEmployee:
      state.selectedEmployee?.id === employee.id ? employee : state.selectedEmployee,
  })),

  on(EmployeeActions.activateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.deactivateEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.deactivateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    error: null,
    employees: state.employees.map((c) => (c.id === employee.id ? employee : c)),
    selectedEmployee:
      state.selectedEmployee?.id === employee.id ? employee : state.selectedEmployee,
  })),

  on(EmployeeActions.deactivateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    employees: state.employees.filter((c) => c.id !== id),
    selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
  })),

  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(EmployeeActions.clearSelectedEmployee, (state) => ({
    ...state,
    selectedEmployee: null,
  }))
);
