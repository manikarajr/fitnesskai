import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout, NavItem } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-super-admin-layout',
  imports: [RouterOutlet, Layout],
  templateUrl: './super-admin-layout.html',
  styleUrl: './super-admin-layout.scss',
})
export class SuperAdminLayout {
userName = 'Super Admin';
  userRole = 'System Administrator';
  userInitials = 'SA';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/super-admin/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Gym Management',
      route: '/super-admin/gyms',
      icon: 'building'
    },
    // {
    //   label: 'Gym Admins',
    //   route: '/super-admin/users/admins',
    //   icon: 'users'
    // },
    {
      label: 'Trainers',
      route: '/super-admin/users/trainers',
      icon: 'trainers'
    },
    {
      label: 'Members',
      route: '/super-admin/users/members',
      icon: 'members'
    },
    {
      label: 'Subscriptions',
      route: '/super-admin/subscriptions',
      icon: 'creditcard'
    },
    {
      label: 'Reports & Analytics',
      route: '/super-admin/reports',
      icon: 'chart'
    },
    {
      label: 'System Settings',
      route: '/super-admin/settings',
      icon: 'settings'
    },
    {
      label: 'Security & Logs',
      route: '/super-admin/security',
      icon: 'settings'
    },
    {
      label: 'Announcements',
      route: '/super-admin/announcements',
      icon: 'bell'
    },
    {
      label: 'Profile',
      route: '/super-admin/profile',
      icon: 'user'
    }
  ];
}
