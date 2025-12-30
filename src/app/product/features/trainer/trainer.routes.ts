import { Routes } from '@angular/router';
import { TrainerLayout } from './trainer-layout/trainer-layout';


export const trainerRoutes: Routes = [
  {
    path: '',
    component: TrainerLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/trainer-dashboard/trainer-dashboard').then(m => m.TrainerDashboard)
      }
      // Add other trainer routes here as children
    ]
  }
];