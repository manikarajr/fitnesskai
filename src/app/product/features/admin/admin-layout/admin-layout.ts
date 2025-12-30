import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout, NavItem } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Layout],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  userName = 'John Smith';
  userRole = 'Gym Owner';
  userInitials = 'JS';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Members',
      route: '/admin/members',
      icon: 'members'
    },
    {
      label: 'Trainers',
      route: '/admin/trainers',
      icon: 'trainers'
    },
    {
      label: 'Membership Plans',
      route: '/admin/plans',
      icon: 'creditcard'
    },
    {
      label: 'Attendance',
      route: '/admin/attendance',
      icon: 'users'
    },
    {
      label: 'Payments',
      route: '/admin/payments',
      icon: 'creditcard'
    },
    {
      label: 'Reports & Analytics',
      route: '/admin/reports',
      icon: 'chart'
    },
    {
      label: 'Settings',
      route: '/admin/settings',
      icon: 'settings'
    },
    {
      label: 'Profile',
      route: '/admin/profile',
      icon: 'user'
    }
  ];
}