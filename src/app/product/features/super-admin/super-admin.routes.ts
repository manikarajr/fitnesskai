import { Routes } from '@angular/router';

export const superAdminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./super-admin-layout/super-admin-layout').then(m => m.SuperAdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/super-admin-dashboard/super-admin-dashboard').then(m => m.SuperAdminDashboard)
      },
      {
        path: 'gyms',
        loadComponent: () => import('./features/gym-management/gym-management').then(m => m.GymManagement)
      },
      {
        path: 'users/admins',
        loadComponent: () => import('./features/user-management/admin-management/admin-management').then(m => m.AdminManagement)
      },
      {
        path: 'users/trainers',
        loadComponent: () => import('./features/user-management/trainer-management/trainer-management').then(m => m.TrainerManagement)
      },
      {
        path: 'users/members',
        loadComponent: () => import('./features/user-management/member-management/member-management').then(m => m.MemberManagement)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./features/subscription/subscription-billing/subscription-billing').then(m => m.SubscriptionBilling)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports-analytics/reports-analytics').then(m => m.ReportsAnalytics)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/system-settings/system-settings').then(m => m.SystemSettings)
      },
      {
        path: 'security',
        loadComponent: () => import('./features/security/security').then(m => m.Security)
      },
      {
        path: 'announcements',
        loadComponent: () => import('./features/announcements/announcements').then(m => m.Announcements)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
      }
    ]
  }
];