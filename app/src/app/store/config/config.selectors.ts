import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ConfigState } from './config.state';

export const selectConfigState = createFeatureSelector<ConfigState>('config');

export const selectConfig = createSelector(selectConfigState, (state: ConfigState) => state.config);

export const selectConfigLoading = createSelector(
  selectConfigState,
  (state: ConfigState) => state.loading
);

export const selectConfigError = createSelector(
  selectConfigState,
  (state: ConfigState) => state.error
);
