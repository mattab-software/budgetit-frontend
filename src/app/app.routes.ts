import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/auth/auth.guards';
import { Shell } from './layout/shell';
import { currentYearMonth, isYearMonth } from './shared/year-month';

const validMonthGuard: CanActivateFn = (route) =>
  isYearMonth(route.paramMap.get('ym')) ||
  inject(Router).createUrlTree(['/months', currentYearMonth()]);

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Sign in | BudgetIt',
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: () => `months/${currentYearMonth()}` },
      {
        path: 'dashboard',
        title: 'Dashboard | BudgetIt',
        loadComponent: () =>
          import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'months/:ym',
        title: 'Month | BudgetIt',
        canActivate: [validMonthGuard],
        loadComponent: () => import('./features/month/month.page').then((m) => m.MonthPage),
      },
      {
        path: 'recurring',
        title: 'Recurring items | BudgetIt',
        loadComponent: () =>
          import('./features/recurring/recurring.page').then((m) => m.RecurringPage),
      },
      {
        path: 'categories',
        title: 'Categories | BudgetIt',
        loadComponent: () =>
          import('./features/categories/categories.page').then((m) => m.CategoriesPage),
      },
      {
        path: 'admin/users',
        title: 'Users | BudgetIt',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () => import('./features/admin/users.page').then((m) => m.UsersPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
