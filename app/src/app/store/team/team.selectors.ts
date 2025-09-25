import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TeamState } from './team.state';

export const selectTeamState = createFeatureSelector<TeamState>('team');

export const selectTeams = createSelector(selectTeamState, (state: TeamState) => state.teams);

export const selectSelectedTeam = createSelector(
  selectTeamState,
  (state: TeamState) => state.selectedTeam
);

export const selectTeamMembers = createSelector(
  selectTeamState,
  (state: TeamState) => state.selectedTeam?.teamMembers
);

export const selectTeamLoading = createSelector(
  selectTeamState,
  (state: TeamState) => state.loading
);

export const selectTeamError = createSelector(selectTeamState, (state: TeamState) => state.error);

export const selectTeamPaginationInfo = createSelector(
  selectTeamState,
  (state: TeamState) => state.pagination
);

export const selectTeamById = (id: number) =>
  createSelector(selectTeams, (teams) => teams.find((team) => team.id === id));
