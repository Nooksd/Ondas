import { createAction, props } from '@ngrx/store';
import { ConfigDTO } from './config.state';

export const loadConfig = createAction('[Config] Load Config', props<{ id: number }>());
export const loadConfigSuccess = createAction(
  '[Config] Load Config Success',
  props<{ config: ConfigDTO }>()
);
export const loadConfigFailure = createAction(
  '[Config] Load Config Failure',
  props<{ error: string }>()
);

export const updateConfig = createAction(
  '[Config] Update Config',
  props<{ id: number; config: ConfigDTO }>()
);
export const updateConfigSuccess = createAction(
  '[Config] Update Config Success',
  props<{ config: ConfigDTO }>()
);
export const updateConfigFailure = createAction(
  '[Config] Update Config Failure',
  props<{ error: string }>()
);

export const testConfig = createAction('[Config] Test Config', props<{ email: string }>());
export const testConfigSuccess = createAction('[Config] Test Config Success');
export const testConfigFailure = createAction(
  '[Config] Test Config Failure',
  props<{ error: string }>()
);
