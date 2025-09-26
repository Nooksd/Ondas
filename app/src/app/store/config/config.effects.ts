import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ConfigActions from './config.actions';
import { ConfigService } from './config.service';
import { ConfigDTO } from './config.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class ConfigEffects {
  private actions$ = inject(Actions);
  private configService = inject(ConfigService);
  private toast = inject(HotToastService);

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadConfig),
      mergeMap(() =>
        this.configService.getConfig().pipe(
          this.toast.observe({
            loading: 'Buscando configuração...',
            success: 'Configuração carregado com sucesso!',
            error: 'Erro ao carregar configuração',
          }),
          map((config: ConfigDTO) => ConfigActions.loadConfigSuccess({ config })),
          catchError((error) =>
            of(
              ConfigActions.loadConfigFailure({
                error: error.message || 'Erro ao carregar configuração',
              })
            )
          )
        )
      )
    )
  );

  updateConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.updateConfig),
      mergeMap((action) =>
        this.configService.updateConfig(action.config).pipe(
          this.toast.observe({
            loading: 'Atualizando configuração...',
            success: 'Configuração atualizado com sucesso!',
            error: 'Erro ao atualizar configuração',
          }),
          map((config: ConfigDTO) => ConfigActions.updateConfigSuccess({ config })),
          catchError((error) =>
            of(
              ConfigActions.updateConfigFailure({
                error: error.message || 'Erro ao atualizar configuração',
              })
            )
          )
        )
      )
    )
  );

  testConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.testConfig),
      mergeMap((action) =>
        this.configService.testConfig(action.email).pipe(
          this.toast.observe({
            loading: 'Testando configuração...',
            success: 'Configuração testado com sucesso!',
            error: 'Erro ao testar configuração',
          }),
          map(() => ConfigActions.testConfigSuccess()),
          catchError((error) =>
            of(
              ConfigActions.testConfigFailure({
                error: error.message || 'Erro ao testar configuração',
              })
            )
          )
        )
      )
    )
  );
}
