import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout, NavItem } from '../../../../shared/components/layout/layout';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Layout],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.scss',
})
export class SuperAdminDashboard {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/super-admin/dashboard',
      icon: 'dashboard' // Use icon name, not SVG path
    },
    {
      label: 'Gyms',
      route: '/super-admin/gyms',
      icon: 'gyms' // Use icon name, not SVG path
    },
    {
      label: 'Admins',
      route: '/super-admin/admins',
      icon: 'admins' // Use icon name, not SVG path
    },
    {
      label: 'Analytics',
      route: '/super-admin/analytics',
      icon: 'analytics' // Use icon name, not SVG path
    },
    {
      label: 'Settings',
      route: '/super-admin/settings',
      icon: 'settings' // Use icon name, not SVG path
    }
  ];

  recentGyms = [
    { id: 1, name: 'PowerHouse Gym', location: 'New York, NY', members: 234 },
    { id: 2, name: 'FitZone Elite', location: 'Los Angeles, CA', members: 189 },
    { id: 3, name: 'Iron Paradise', location: 'Chicago, IL', members: 156 },
    { id: 4, name: 'Muscle Factory', location: 'Houston, TX', members: 201 }
  ];
}