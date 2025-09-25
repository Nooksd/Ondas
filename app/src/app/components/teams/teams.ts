import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import { activateTeam, deactivateTeam, deleteTeam, loadTeams } from 'app/store/team/team.actions';
import {
  selectTeamLoading,
  selectTeamPaginationInfo,
  selectTeams,
} from 'app/store/team/team.selectors';
import { TeamDTO, TeamFilters, PaginationDTO } from 'app/store/team/team.state';

@Component({
  selector: 'app-teams',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './teams.html',
  styleUrls: ['./teams.scss'],
})
export class Teams {
  private store = inject(Store);
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private modal = inject(ModalService);

  teams = signal<TeamDTO[] | null>(null);
  pagingInfo = signal<PaginationDTO | null>(null);
  isLoading = signal<boolean>(false);
  filter = signal<TeamFilters>({
    page: 1,
    size: 10,
    q: '',
    isActive: true,
  });

  ngOnInit() {
    this.setupHeader();

    if (!this.teams() || this.teams()?.length === 0) {
      this.store.dispatch(loadTeams({ query: this.filter() }));
    }
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Nova Equipe',
        onClick: () => {
          this.router.navigate(['/equipes/novo']);
        },
      },
    });
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  constructor() {
    this.store.select(selectTeams).subscribe((teams) => {
      this.teams.set(teams);
    });

    this.store.select(selectTeamPaginationInfo).subscribe((paginationInfo) => {
      this.pagingInfo.set(paginationInfo);
    });

    this.store.select(selectTeamLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  updateFilter(field: keyof TeamFilters, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = field === 'page' || field === 'size' ? parseInt(target.value) : target.value;

    const currentFilter = this.filter();
    const newFilter = {
      ...currentFilter,
      [field]: value,
    };

    if (field === 'q' || field === 'size') {
      newFilter.page = 1;
    }

    this.filter.set(newFilter);
  }

  updateIsActive(isActive: boolean) {
    const newFilter = {
      ...this.filter(),
      isActive: isActive,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadTeams({ query: newFilter }));
  }

  searchTeams() {
    console.log(this.filter());
    this.store.dispatch(loadTeams({ query: this.filter() }));
  }

  changePage(page: number) {
    const newFilter = {
      ...this.filter(),
      page: page,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadTeams({ query: newFilter }));
  }

  getStartItem(): number {
    const paging = this.pagingInfo();
    if (!paging) return 0;
    return (paging.currentPage - 1) * paging.pageSize + 1;
  }

  getEndItem(): number {
    const paging = this.pagingInfo();

    if (!paging) return 0;
    const end = paging.currentPage * paging.pageSize;
    return Math.min(end, paging.totalCount);
  }

  getVisiblePages(): number[] {
    const totalPages = this.pagingInfo()?.totalPages || 1;
    const currentPage = this.filter().page || 1;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  editTeam(id: number) {
    this.router.navigate([`/equipes/${id}`]);
  }

  toggleTeamStatus(id: number, status: boolean) {
    if (status) {
      this.store.dispatch(deactivateTeam({ id }));
    } else {
      this.store.dispatch(activateTeam({ id }));
    }
  }

  async deleteTeam(id: number) {
    const ok = await this.modal.confirm(
      'Deletar equipe',
      'Deseja realmente deletar este equipe? Esta ação não pode ser desfeita.',
      'Deletar',
      'Cancelar'
    );

    if (!ok) return;

    this.store.dispatch(deleteTeam({ id }));
  }

  filteredTeams = computed(() =>
    this.teams() ? this.teams()!.filter((t) => t.isActive === this.filter().isActive) : []
  );
}
