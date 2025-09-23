import { Component, HostListener, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-ui',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './ui.html',
  styleUrl: './ui.scss',
})
export class Ui {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  breadcrumb = signal<string>('');
  title = signal<string>('');
  profileMenuOpen = signal<boolean>(false);
  elementRef: any;

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const routeData = this.getRouteData();
      this.breadcrumb.set(routeData?.breadcrumb || 'padrão');
      this.title.set(routeData?.title || 'padrão');
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
