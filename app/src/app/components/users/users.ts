import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import {
  deleteUser,
  loadUsers,
  addRole,
  removeRole,
  adminChangePassword,
} from 'app/store/user/user.actions';
import {
  selectUserLoading,
  selectUserPaginationInfo,
  selectUsers,
} from 'app/store/user/user.selectors';
import { UserDTO, UserFilters, PaginationDTO } from 'app/store/user/user.state';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users {
  private store = inject(Store);
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private modal = inject(ModalService);

  users = signal<UserDTO[] | null>(null);
  pagingInfo = signal<PaginationDTO | null>(null);
  isLoading = signal<boolean>(false);
  filter = signal<UserFilters>({
    page: 1,
    size: 10,
    q: '',
  });

  ngOnInit() {
    this.setupHeader();

    if (!this.users() || this.users()?.length === 0) {
      this.store.dispatch(loadUsers({ query: this.filter() }));
    }
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Novo Usuário',
        onClick: () => {
          this.router.navigate(['/usuarios/novo']);
        },
      },
    });
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  constructor() {
    this.store.select(selectUsers).subscribe((users) => {
      this.users.set(users);
    });

    this.store.select(selectUserPaginationInfo).subscribe((paginationInfo) => {
      this.pagingInfo.set(paginationInfo);
    });

    this.store.select(selectUserLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  updateFilter(field: keyof UserFilters, event: Event) {
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

  searchUsers() {
    this.store.dispatch(loadUsers({ query: this.filter() }));
  }

  changePage(page: number) {
    const newFilter = {
      ...this.filter(),
      page: page,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadUsers({ query: newFilter }));
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

  editUser(id: string) {
    this.router.navigate([`/usuarios/${id}`]);
  }

  async deleteUser(id: string) {
    const ok = await this.modal.confirm(
      'Deletar usuário',
      'Deseja realmente deletar este usuário? Esta ação não pode ser desfeita.',
      'Deletar',
      'Cancelar'
    );

    if (!ok) return;

    this.store.dispatch(deleteUser({ id }));
  }

  async changePassword(id: string) {
    const newPassword = await this.modal.promptPassword();

    if (!newPassword) return;

    this.store.dispatch(adminChangePassword({ id, newPassword }));
  }

  async addRole(id: string) {
    const user = this.users()?.find((x) => x.id === id);

    if (!user) return;

    const roles = ['Viewer', 'Editor', 'Admin'];

    const newRoles = roles.filter((x) => !user.roles?.includes(x));

    const roleName = await this.modal.selectOption(newRoles, 'Qual permissão deseja adicionar?');

    if (!roleName) return;

    this.store.dispatch(addRole({ id, roleName }));
  }

  async removeRole(id: string) {
    const user = this.users()?.find((x) => x.id === id);

    if (!user) return;

    const roleName = await this.modal.selectOption(
      user.roles || [],
      'Qual permissão deseja remover?'
    );

    if (!roleName) return;

    this.store.dispatch(removeRole({ id, roleName }));
  }
}
