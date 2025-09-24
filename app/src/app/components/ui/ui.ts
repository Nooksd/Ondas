import { Component, HostListener, inject, signal, viewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from 'app/store/auth/auth.actions';
import { filter } from 'rxjs';
import { HeaderService } from 'app/services/header.service';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-ui',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgComponentOutlet],
  templateUrl: './ui.html',
  styleUrl: './ui.scss',
})
export class Ui {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);
  private headerService = inject(HeaderService);

  breadcrumb = signal<string>('');
  title = signal<string>('');
  routes = signal<string[]>([]);

  breadcrumbRoute(i: number): string {
    const routes = this.routes();
    if (!routes || routes.length === 0) return '';
    return routes.slice(0, i + 1).join('/');
  }
  profileMenuOpen = signal<boolean>(false);

  headerConfig = this.headerService.config;

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const routeData = this.getRouteData();
      this.breadcrumb.set(routeData?.breadcrumb.split('/') || 'padrão');
      this.title.set(routeData?.title.split('/') || 'padrão');
      this.routes.set(routeData?.routes || []);
    });
  }

  private getRouteData(): any {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route?.snapshot.data;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.classList.contains('profile-avatar')) {
      this.closeProfileMenu();
    }
  }

  onProfileClick(): void {
    this.router.navigate(['/perfil']);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.set(!this.profileMenuOpen());
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  onLogoutClick(): void {
    this.store.dispatch(logout());
  }
}
