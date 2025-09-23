import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as DashboardActions from './dashboard.actions';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDTO } from './dashboard.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);
  private toast = inject(HotToastService);

  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardStats),
      mergeMap((action) =>
        this.dashboardService.getDashboardStats(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando estatísticas...',
            success: 'Estatísticas carregadas com sucesso!',
            error: 'Erro ao carregar estatísticas',
          }),
          map((stats: DashboardStatsDTO) =>
            DashboardActions.loadDashboardStatsSuccess({ stats, query: action.query })
          ),
          catchError((error) =>
            of(
              DashboardActions.loadDashboardStatsFailure({
                error: error.message || 'Erro ao carregar estatísticas do dashboard',
              })
            )
          )
        )
      )
    )
  );
}
