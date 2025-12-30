import { Routes } from '@angular/router';
import { MemberLayout } from './member-layout/member-layout';


export const memberRoutes: Routes = [
  {
    path: '',
    component: MemberLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./member-dashboard/member-dashboard').then(m => m.MemberDashboard)
      }
      // Add other member routes here as children
    ]
  }
];