import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { Role } from '../core/auth/current-user';
import { currentYearMonth } from '../shared/year-month';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  /** First URL segment that marks this item as active, e.g. `months` for `/months/2026-10`. */
  section: string;
  roles?: Role[];
}

/** Layout for every signed-in page: side navigation, top toolbar with the user menu, content area. */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  readonly isHandset = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  private readonly currentSection = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => sectionOf(this.router.url)),
    ),
    { initialValue: sectionOf(this.router.url) },
  );

  readonly navItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: 'Dashboard', icon: 'dashboard', link: '/dashboard', section: 'dashboard' },
      { label: 'Months', icon: 'calendar_month', link: `/months/${currentYearMonth()}`, section: 'months' },
      { label: 'Recurring items', icon: 'event_repeat', link: '/recurring', section: 'recurring' },
      { label: 'Categories', icon: 'category', link: '/categories', section: 'categories' },
      { label: 'Users', icon: 'group', link: '/admin/users', section: 'admin', roles: ['ADMIN'] },
    ];
    // hasRole() reads the user signal, so this list updates when the user changes.
    return items.filter((item) => !item.roles || this.auth.hasRole(...item.roles));
  });

  isActive(item: NavItem): boolean {
    return this.currentSection() === item.section;
  }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

function sectionOf(url: string): string {
  return url.split(/[/?#]/).find((segment) => segment.length > 0) ?? '';
}
