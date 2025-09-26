import { createAction, props } from '@ngrx/store';
import { TeamDTO, TeamFilters, PaginationDTO } from './team.state';

export const loadTeams = createAction('[Team] Load Teams', props<{ query?: TeamFilters }>());
export const loadTeamsSuccess = createAction(
  '[Team] Load Teams Success',
  props<{ teams: TeamDTO[]; pagination: PaginationDTO }>()
);
export const loadTeamsFailure = createAction(
  '[Team] Load Teams Failure',
  props<{ error: string }>()
);

export const loadTeam = createAction('[Team] Load Team', props<{ id: number }>());
export const loadTeamSuccess = createAction('[Team] Load Team Success', props<{ team: TeamDTO }>());
export const loadTeamFailure = createAction('[Team] Load Team Failure', props<{ error: string }>());

export const createTeam = createAction('[Team] Create Team', props<{ team: TeamDTO }>());
export const createTeamSuccess = createAction(
  '[Team] Create Team Success',
  props<{ team: TeamDTO }>()
);
export const createTeamFailure = createAction(
  '[Team] Create Team Failure',
  props<{ error: string }>()
);

export const addTeamMember = createAction(
  '[Team] Add Team Member',
  props<{ teamId: number; employeeId: number }>()
);
export const addTeamMemberSuccess = createAction(
  '[Team] Add Team Member Success',
  props<{ team: TeamDTO }>()
);
export const addTeamMemberFailure = createAction(
  '[Team] Add Team Member Failure',
  props<{ error: string }>()
);

export const removeTeamMember = createAction(
  '[Team] Remove Team Member',
  props<{ teamId: number; employeeId: number }>()
);
export const removeTeamMemberSuccess = createAction(
  '[Team] Remove Team Member Success',
  props<{ team: TeamDTO }>()
);
export const removeTeamMemberFailure = createAction(
  '[Team] Remove Team Member Failure',
  props<{ error: string }>()
);

export const updateTeam = createAction(
  '[Team] Update Team',
  props<{ id: number; team: TeamDTO }>()
);
export const updateTeamSuccess = createAction(
  '[Team] Update Team Success',
  props<{ team: TeamDTO }>()
);
export const updateTeamFailure = createAction(
  '[Team] Update Team Failure',
  props<{ error: string }>()
);

export const deleteTeam = createAction('[Team] Delete Team', props<{ id: number }>());
export const deleteTeamSuccess = createAction(
  '[Team] Delete Team Success',
  props<{ id: number }>()
);
export const deleteTeamFailure = createAction(
  '[Team] Delete Team Failure',
  props<{ error: string }>()
);

export const activateTeam = createAction('[Team] Activate Team', props<{ id: number }>());
export const activateTeamSuccess = createAction(
  '[Team] Activate Team Success',
  props<{ team: TeamDTO }>()
);
export const activateTeamFailure = createAction(
  '[Team] Activate Team Failure',
  props<{ error: string }>()
);

export const deactivateTeam = createAction('[Team] Deactivate Team', props<{ id: number }>());
export const deactivateTeamSuccess = createAction(
  '[Team] Deactivate Team Success',
  props<{ team: TeamDTO }>()
);
export const deactivateTeamFailure = createAction(
  '[Team] Deactivate Team Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Team] Clear Error');

export const clearSelectedTeam = createAction('[Team] Clear Selected Team');

export const clearTeams = createAction('[Team] Clear Teams');
