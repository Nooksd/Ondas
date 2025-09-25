import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TeamActions from './team.actions';
import { TeamService } from './team.service';
import { TeamDTO } from './team.state';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable()
export class TeamEffects {
  private actions$ = inject(Actions);
  private teamService = inject(TeamService);
  private toast = inject(HotToastService);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.loadTeams),
      mergeMap((action) =>
        this.teamService.getTeams(action.query).pipe(
          this.toast.observe({
            loading: 'Buscando equipes...',
            error: 'Erro ao carregar equipes',
          }),
          map((response) => {
            return TeamActions.loadTeamsSuccess({
              teams: response.teams,
              pagination: response.metadata,
            });
          }),
          catchError((error) =>
            of(
              TeamActions.loadTeamsFailure({
                error: error.message || 'Erro ao carregar equipes',
              })
            )
          )
        )
      )
    )
  );

  loadTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.loadTeam),
      mergeMap((action) =>
        this.teamService.getTeam(action.id).pipe(
          this.toast.observe({
            loading: 'Buscando equipe...',
            success: 'Equipe carregado com sucesso!',
            error: 'Erro ao carregar equipe',
          }),
          map((team: TeamDTO) => TeamActions.loadTeamSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.loadTeamFailure({
                error: error.message || 'Erro ao carregar equipe',
              })
            )
          )
        )
      )
    )
  );

  createTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.createTeam),
      mergeMap((action) =>
        this.teamService.createTeam(action.team).pipe(
          this.toast.observe({
            loading: 'Criando equipe...',
            success: 'Equipe criado com sucesso!',
            error: 'Erro ao criar equipe',
          }),
          map((team: TeamDTO) => TeamActions.createTeamSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.createTeamFailure({
                error: error.message || 'Erro ao criar equipe',
              })
            )
          )
        )
      )
    )
  );

  addTeamMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.addTeamMember),
      mergeMap((action) =>
        this.teamService.addTeamMember(action.teamId, action.employeeId).pipe(
          this.toast.observe({
            loading: 'Adicionando equipe...',
            success: 'Equipe adicionado com sucesso!',
            error: 'Erro ao adicionar equipe',
          }),
          map((team: TeamDTO) => TeamActions.addTeamMemberSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.addTeamMemberFailure({
                error: error.message || 'Erro ao adicionar equipe',
              })
            )
          )
        )
      )
    )
  );

  removeTeamMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.removeTeamMember),
      mergeMap((action) =>
        this.teamService.removeTeamMember(action.teamId, action.employeeId).pipe(
          this.toast.observe({
            loading: 'Removendo equipe...',
            success: 'Equipe removido com sucesso!',
            error: 'Erro ao remover equipe',
          }),
          map((team: TeamDTO) => TeamActions.removeTeamMemberSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.removeTeamMemberFailure({
                error: error.message || 'Erro ao remover equipe',
              })
            )
          )
        )
      )
    )
  );

  updateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.updateTeam),
      mergeMap((action) =>
        this.teamService.updateTeam(action.id, action.team).pipe(
          this.toast.observe({
            loading: 'Atualizando equipe...',
            success: 'Equipe atualizado com sucesso!',
            error: 'Erro ao atualizar equipe',
          }),
          map((team: TeamDTO) => TeamActions.updateTeamSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.updateTeamFailure({
                error: error.message || 'Erro ao atualizar equipe',
              })
            )
          )
        )
      )
    )
  );

  activateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.activateTeam),
      mergeMap((action) =>
        this.teamService.activateTeam(action.id).pipe(
          this.toast.observe({
            loading: 'Ativando equipe...',
            success: 'Equipe ativado com sucesso!',
            error: 'Erro ao ativar equipe',
          }),
          map((team: TeamDTO) => TeamActions.activateTeamSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.activateTeamFailure({
                error: error.message || 'Erro ao ativar equipe',
              })
            )
          )
        )
      )
    )
  );

  deactivateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.deactivateTeam),
      mergeMap((action) =>
        this.teamService.deactivateTeam(action.id).pipe(
          this.toast.observe({
            loading: 'Desativando equipe...',
            success: 'Equipe desativado com sucesso!',
            error: 'Erro ao desativar equipe',
          }),
          map((team: TeamDTO) => TeamActions.deactivateTeamSuccess({ team })),
          catchError((error) =>
            of(
              TeamActions.deactivateTeamFailure({
                error: error.message || 'Erro ao desativar equipe',
              })
            )
          )
        )
      )
    )
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.deleteTeam),
      mergeMap((action) =>
        this.teamService.deleteTeam(action.id).pipe(
          this.toast.observe({
            loading: 'Excluindo equipe...',
            success: 'Equipe excluído com sucesso!',
            error: 'Erro ao excluir equipe',
          }),
          map(() => TeamActions.deleteTeamSuccess({ id: action.id })),
          catchError((error) =>
            of(
              TeamActions.deleteTeamFailure({
                error: error.message || 'Erro ao excluir equipe',
              })
            )
          )
        )
      )
    )
  );
}
