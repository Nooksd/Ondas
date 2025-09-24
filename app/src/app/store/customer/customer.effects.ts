import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as CustomerActions from './customer.actions';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './customer.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerService = inject(CustomerService);
  private toast = inject(HotToastService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      mergeMap((action) =>
        this.customerService.getCustomers(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando clientes...',
            success: 'Clientes carregadas com sucesso!',
            error: 'Erro ao carregar clientes',
          }),
          map((response) =>
            CustomerActions.loadCustomersSuccess({
              customers: response.customers,
              totalItems: response.totalItems,
              currentPage: response.currentPage,
              pageSize: response.pageSize,
            })
          ),
          catchError((error) =>
            of(
              CustomerActions.loadCustomersFailure({
                error: error.message || 'Erro ao carregar clientes',
              })
            )
          )
        )
      )
    )
  );

  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomer),
      mergeMap((action) =>
        this.customerService.getCustomer(action.id).pipe(
          this.toast.observe({
            loading: 'Buscando cliente...',
            success: 'Cliente carregado com sucesso!',
            error: 'Erro ao carregar cliente',
          }),
          map((customer: CustomerDTO) => CustomerActions.loadCustomerSuccess({ customer })),
          catchError((error) =>
            of(
              CustomerActions.loadCustomerFailure({
                error: error.message || 'Erro ao carregar cliente',
              })
            )
          )
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      mergeMap((action) =>
        this.customerService.createCustomer(action.customer).pipe(
          this.toast.observe({
            loading: 'Criando cliente...',
            success: 'Cliente criado com sucesso!',
            error: 'Erro ao criar cliente',
          }),
          map((customer: CustomerDTO) => CustomerActions.createCustomerSuccess({ customer })),
          catchError((error) =>
            of(
              CustomerActions.createCustomerFailure({
                error: error.message || 'Erro ao criar cliente',
              })
            )
          )
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap((action) =>
        this.customerService.updateCustomer(action.id, action.customer).pipe(
          this.toast.observe({
            loading: 'Atualizando cliente...',
            success: 'Cliente atualizado com sucesso!',
            error: 'Erro ao atualizar cliente',
          }),
          map((customer: CustomerDTO) => CustomerActions.updateCustomerSuccess({ customer })),
          catchError((error) =>
            of(
              CustomerActions.updateCustomerFailure({
                error: error.message || 'Erro ao atualizar cliente',
              })
            )
          )
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap((action) =>
        this.customerService.deleteCustomer(action.id).pipe(
          this.toast.observe({
            loading: 'Excluindo cliente...',
            success: 'Cliente excluído com sucesso!',
            error: 'Erro ao excluir cliente',
          }),
          map(() => CustomerActions.deleteCustomerSuccess({ id: action.id })),
          catchError((error) =>
            of(
              CustomerActions.deleteCustomerFailure({
                error: error.message || 'Erro ao excluir cliente',
              })
            )
          )
        )
      )
    )
  );
}
