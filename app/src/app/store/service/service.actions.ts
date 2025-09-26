import { createAction, props } from '@ngrx/store';
import { ServiceDTO, ServiceFilters, ChangeStatusDTO } from './service.state';

export const loadServices = createAction(
  '[Service] Load Services',
  props<{ query?: ServiceFilters }>()
);
export const loadServicesSuccess = createAction(
  '[Service] Load Services Success',
  props<{ services: ServiceDTO[] }>()
);
export const loadServicesFailure = createAction(
  '[Service] Load Services Failure',
  props<{ error: string }>()
);

export const loadService = createAction('[Service] Load Service', props<{ id: number }>());
export const loadServiceSuccess = createAction(
  '[Service] Load Service Success',
  props<{ service: ServiceDTO }>()
);
export const loadServiceFailure = createAction(
  '[Service] Load Service Failure',
  props<{ error: string }>()
);

export const createService = createAction(
  '[Service] Create Service',
  props<{ service: ServiceDTO }>()
);
export const createServiceSuccess = createAction(
  '[Service] Create Service Success',
  props<{ service: ServiceDTO }>()
);
export const createServiceFailure = createAction(
  '[Service] Create Service Failure',
  props<{ error: string }>()
);

export const updateService = createAction(
  '[Service] Update Service',
  props<{ id: number; service: ServiceDTO }>()
);
export const updateServiceSuccess = createAction(
  '[Service] Update Service Success',
  props<{ service: ServiceDTO }>()
);
export const updateServiceFailure = createAction(
  '[Service] Update Service Failure',
  props<{ error: string }>()
);

export const changeServiceStatus = createAction(
  '[Service] Change Status Service',
  props<{ id: number; newStatus: ChangeStatusDTO }>()
);
export const changeServiceStatusSuccess = createAction(
  '[Service] Change Status Service Success',
  props<{ service: ServiceDTO }>()
);
export const changeServiceStatusFailure = createAction(
  '[Service] Change Status Service Failure',
  props<{ error: string }>()
);

export const deleteService = createAction('[Service] Delete Service', props<{ id: number }>());
export const deleteServiceSuccess = createAction(
  '[Service] Delete Service Success',
  props<{ id: number }>()
);
export const deleteServiceFailure = createAction(
  '[Service] Delete Service Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Service] Clear Error');

export const clearSelectedService = createAction('[Service] Clear Selected Service');
