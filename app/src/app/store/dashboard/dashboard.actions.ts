import { createAction, props } from '@ngrx/store';
import { DashboardStatsDTO, DashboardQuery } from './dashboard.state';

export const loadDashboardStats = createAction(
  '[Dashboard] Load Dashboard Stats',
  props<{ query: DashboardQuery }>()
);
export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Dashboard Stats Success',
  props<{ stats: DashboardStatsDTO; query: DashboardQuery }>()
);
export const loadDashboardStatsFailure = createAction(
  '[Dashboard] Load Dashboard Stats Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Dashboard] Clear Error');
