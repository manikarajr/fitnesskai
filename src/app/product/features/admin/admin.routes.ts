import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'members',
        loadComponent: () => import('./features/member/admin-member-management/admin-member-management').then(m => m.AdminMemberManagement)
      },
      {
        path: 'trainers',
        loadComponent: () => import('./features/trainer/admin-trainer-management/admin-trainer-management').then(m => m.AdminTrainerManagement)
      },
      {
        path: 'plans',
        loadComponent: () => import('./features/plans/admin-membership-plans-management/admin-membership-plans-management').then(m => m.AdminMembershipPlansManagement)
      },
      // Alternative if files are directly under features/admin/
{
  path: 'attendance',
  loadComponent: () => import('./features/attendance/admin-attendance/admin-attendance').then(m => m.AdminAttendance)
},
{
  path: 'payments',
  loadComponent: () => import('./features/payments/admin-payments/admin-payments').then(m => m.AdminPayments)
},
{
  path: 'reports',
  loadComponent: () => import('./features/reports/admin-reports/admin-reports').then(m => m.AdminReports)
},
{
  path: 'settings',
  loadComponent: () => import('./features/settings/admin-settings/admin-settings').then(m => m.AdminSettings)
},
    ]
  }
];