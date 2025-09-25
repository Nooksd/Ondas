import { createReducer, on } from '@ngrx/store';
import { initialTeamState } from './team.state';
import * as TeamActions from './team.actions';

export const teamReducer = createReducer(
  initialTeamState,

  on(TeamActions.loadTeams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.loadTeamsSuccess, (state, { teams, pagination }) => ({
    ...state,
    loading: false,
    error: null,
    teams,
    pagination,
  })),

  on(TeamActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.loadTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.loadTeamSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    selectedTeam: team,
  })),

  on(TeamActions.loadTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.createTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.createTeamSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: [...state.teams, team],
  })),

  on(TeamActions.createTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.addTeamMember, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.addTeamMemberSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.map((c) => (c.id === team.id ? team : c)),
    selectedTeam: state.selectedTeam?.id === team.id ? team : state.selectedTeam,
  })),

  on(TeamActions.addTeamMemberFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.removeTeamMember, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.removeTeamMemberSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.map((c) => (c.id === team.id ? team : c)),
    selectedTeam: state.selectedTeam?.id === team.id ? team : state.selectedTeam,
  })),

  on(TeamActions.removeTeamMemberFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.updateTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.updateTeamSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.map((c) => (c.id === team.id ? team : c)),
    selectedTeam: state.selectedTeam?.id === team.id ? team : state.selectedTeam,
  })),

  on(TeamActions.updateTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.activateTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.activateTeamSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.map((c) => (c.id === team.id ? team : c)),
    selectedTeam: state.selectedTeam?.id === team.id ? team : state.selectedTeam,
  })),

  on(TeamActions.activateTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.deactivateTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.deactivateTeamSuccess, (state, { team }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.map((c) => (c.id === team.id ? team : c)),
    selectedTeam: state.selectedTeam?.id === team.id ? team : state.selectedTeam,
  })),

  on(TeamActions.deactivateTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.deleteTeam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TeamActions.deleteTeamSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    error: null,
    teams: state.teams.filter((c) => c.id !== id),
    selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam,
  })),

  on(TeamActions.deleteTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TeamActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(TeamActions.clearSelectedTeam, (state) => ({
    ...state,
    selectedTeam: null,
  }))
);
