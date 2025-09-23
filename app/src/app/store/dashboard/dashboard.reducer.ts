import { createReducer, on } from '@ngrx/store';
import { initialDashboardState } from './dashboard.state';
import * as DashboardActions from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,

  on(DashboardActions.loadDashboardStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardStatsSuccess, (state, { stats, query }) => ({
    ...state,
    loading: false,
    error: null,
    stats,
    lastQuery: query,
  })),

  on(DashboardActions.loadDashboardStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DashboardActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
