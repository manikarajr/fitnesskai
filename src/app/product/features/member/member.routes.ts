import { Routes } from '@angular/router';

export const memberRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./member-dashboard/member-dashboard').then(m => m.MemberDashboard)
  }
];