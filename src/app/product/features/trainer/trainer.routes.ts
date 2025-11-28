import { Routes } from '@angular/router';

export const trainerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/trainer-dashboard/trainer-dashboard').then(m => m.TrainerDashboard)
  }
];