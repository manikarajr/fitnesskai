import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./website/website.routes').then(m => m.websiteRoutes)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./product/core/auth/login.routes').then(m => m.loginRoutes)
  },
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./product/features/super-admin/super-admin.routes').then(m => m.superAdminRoutes)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./product/features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'trainer',
    loadChildren: () =>
      import('./product/features/trainer/trainer.routes').then(m => m.trainerRoutes)
  },
  {
    path: 'member',
    loadChildren: () =>
      import('./product/features/member/member.routes').then(m => m.memberRoutes)
  }
];
