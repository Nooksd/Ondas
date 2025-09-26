import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ServiceActions from './service.actions';
import { ServiceService } from './service.service';
import { ServiceDTO } from './service.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class ServiceEffects {
  private actions$ = inject(Actions);
  private serviceService = inject(ServiceService);
  private toast = inject(HotToastService);

  loadServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.loadServices),
      mergeMap((action) =>
        this.serviceService.getServices(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando serviços...',
            error: 'Erro ao carregar serviços',
          }),
          map((response) => {
            return ServiceActions.loadServicesSuccess({
              services: response.services,
              pagination: response.metadata,
            });
          }),
          catchError((error) =>
            of(
              ServiceActions.loadServicesFailure({
                error: error.message || 'Erro ao carregar serviços',
              })
            )
          )
        )
      )
    )
  );

  loadService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.loadService),
      mergeMap((action) =>
        this.serviceService.getService(action.id).pipe(
          this.toast.observe({
            loading: 'Buscando serviço...',
            success: 'Serviço carregado com sucesso!',
            error: 'Erro ao carregar serviço',
          }),
          map((service: ServiceDTO) => ServiceActions.loadServiceSuccess({ service })),
          catchError((error) =>
            of(
              ServiceActions.loadServiceFailure({
                error: error.message || 'Erro ao carregar serviço',
              })
            )
          )
        )
      )
    )
  );

  createService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.createService),
      mergeMap((action) =>
        this.serviceService.createService(action.service).pipe(
          this.toast.observe({
            loading: 'Criando serviço...',
            success: 'Serviço criado com sucesso!',
            error: 'Erro ao criar serviço',
          }),
          map((service: ServiceDTO) => ServiceActions.createServiceSuccess({ service })),
          catchError((error) =>
            of(
              ServiceActions.createServiceFailure({
                error: error.message || 'Erro ao criar serviço',
              })
            )
          )
        )
      )
    )
  );

  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.updateService),
      mergeMap((action) =>
        this.serviceService.updateService(action.id, action.service).pipe(
          this.toast.observe({
            loading: 'Atualizando serviço...',
            success: 'Serviço atualizado com sucesso!',
            error: 'Erro ao atualizar serviço',
          }),
          map((service: ServiceDTO) => ServiceActions.updateServiceSuccess({ service })),
          catchError((error) =>
            of(
              ServiceActions.updateServiceFailure({
                error: error.message || 'Erro ao atualizar serviço',
              })
            )
          )
        )
      )
    )
  );

  changeServiceStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.changeServiceStatus),
      mergeMap((action) =>
        this.serviceService.changeStatusService(action.id, action.newStatus).pipe(
          this.toast.observe({
            loading: 'Alterando status do serviço...',
            success: 'Status do serviço alterado com sucesso!',
            error: 'Erro ao alterar status do serviço',
          }),
          map((service: ServiceDTO) => ServiceActions.changeServiceStatusSuccess({ service })),
          catchError((error) =>
            of(
              ServiceActions.changeServiceStatusFailure({
                error: error.message || 'Erro ao alterar status do serviço',
              })
            )
          )
        )
      )
    )
  );

  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceActions.deleteService),
      mergeMap((action) =>
        this.serviceService.deleteService(action.id).pipe(
          this.toast.observe({
            loading: 'Excluindo serviço...',
            success: 'Serviço excluído com sucesso!',
            error: 'Erro ao excluir serviço',
          }),
          map(() => ServiceActions.deleteServiceSuccess({ id: action.id })),
          catchError((error) =>
            of(
              ServiceActions.deleteServiceFailure({
                error: error.message || 'Erro ao excluir serviço',
              })
            )
          )
        )
      )
    )
  );
}
