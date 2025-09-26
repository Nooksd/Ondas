import { createReducer, on } from '@ngrx/store';
import { initialConfigState } from './config.state';
import * as ConfigActions from './config.actions';

export const configReducer = createReducer(
  initialConfigState,

  on(ConfigActions.loadConfig, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ConfigActions.loadConfigSuccess, (state, { config }) => ({
    ...state,
    loading: false,
    error: null,
    selectedConfig: config,
  })),

  on(ConfigActions.loadConfigFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ConfigActions.updateConfig, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ConfigActions.updateConfigSuccess, (state, { config }) => ({
    ...state,
    loading: false,
    error: null,
    config: config,
  })),

  on(ConfigActions.updateConfigFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ConfigActions.testConfig, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ConfigActions.testConfigSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(ConfigActions.testConfigFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
