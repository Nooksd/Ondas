import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as EmployeeActions from './employee.actions';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from './employee.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private employeeService = inject(EmployeeService);
  private toast = inject(HotToastService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap((action) =>
        this.employeeService.getEmployees(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando funcionários...',
            success: 'Funcionários carregadas com sucesso!',
            error: 'Erro ao carregar funcionários',
          }),
          map((response) => {
            return EmployeeActions.loadEmployeesSuccess({
              employees: response.employees,
              pagination: response.metadata,
            });
          }),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: error.message || 'Erro ao carregar funcionários',
              })
            )
          )
        )
      )
    )
  );

  loadEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployee),
      mergeMap((action) =>
        this.employeeService.getEmployee(action.id).pipe(
          this.toast.observe({
            loading: 'Buscando funcionário...',
            success: 'Funcionário carregado com sucesso!',
            error: 'Erro ao carregar funcionário',
          }),
          map((employee: EmployeeDTO) => EmployeeActions.loadEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeeFailure({
                error: error.message || 'Erro ao carregar funcionário',
              })
            )
          )
        )
      )
    )
  );

  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      mergeMap((action) =>
        this.employeeService.createEmployee(action.employee).pipe(
          this.toast.observe({
            loading: 'Criando funcionário...',
            success: 'Funcionário criado com sucesso!',
            error: 'Erro ao criar funcionário',
          }),
          map((employee: EmployeeDTO) => EmployeeActions.createEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.createEmployeeFailure({
                error: error.message || 'Erro ao criar funcionário',
              })
            )
          )
        )
      )
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      mergeMap((action) =>
        this.employeeService.updateEmployee(action.id, action.employee).pipe(
          this.toast.observe({
            loading: 'Atualizando funcionário...',
            success: 'Funcionário atualizado com sucesso!',
            error: 'Erro ao atualizar funcionário',
          }),
          map((employee: EmployeeDTO) => EmployeeActions.updateEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.updateEmployeeFailure({
                error: error.message || 'Erro ao atualizar funcionário',
              })
            )
          )
        )
      )
    )
  );

  activateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.activateEmployee),
      mergeMap((action) =>
        this.employeeService.activateEmployee(action.id).pipe(
          this.toast.observe({
            loading: 'Ativando funcionário...',
            success: 'Funcionário ativado com sucesso!',
            error: 'Erro ao ativar funcionário',
          }),
          map((employee: EmployeeDTO) => EmployeeActions.activateEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.activateEmployeeFailure({
                error: error.message || 'Erro ao ativar funcionário',
              })
            )
          )
        )
      )
    )
  );

  deactivateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deactivateEmployee),
      mergeMap((action) =>
        this.employeeService.deactivateEmployee(action.id).pipe(
          this.toast.observe({
            loading: 'Desativando funcionário...',
            success: 'Funcionário desativado com sucesso!',
            error: 'Erro ao desativar funcionário',
          }),
          map((employee: EmployeeDTO) => EmployeeActions.deactivateEmployeeSuccess({ employee })),
          catchError((error) =>
            of(
              EmployeeActions.deactivateEmployeeFailure({
                error: error.message || 'Erro ao desativar funcionário',
              })
            )
          )
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap((action) =>
        this.employeeService.deleteEmployee(action.id).pipe(
          this.toast.observe({
            loading: 'Excluindo funcionário...',
            success: 'Funcionário excluído com sucesso!',
            error: 'Erro ao excluir funcionário',
          }),
          map(() => EmployeeActions.deleteEmployeeSuccess({ id: action.id })),
          catchError((error) =>
            of(
              EmployeeActions.deleteEmployeeFailure({
                error: error.message || 'Erro ao excluir funcionário',
              })
            )
          )
        )
      )
    )
  );
}
