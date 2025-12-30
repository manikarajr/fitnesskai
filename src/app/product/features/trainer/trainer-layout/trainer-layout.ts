import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout, NavItem } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-trainer-layout',
  standalone: true,
  imports: [RouterOutlet, Layout],
  templateUrl: './trainer-layout.html',
  styleUrl: './trainer-layout.scss',
})
export class TrainerLayout {
  userName = 'Mike Johnson';
  userRole = 'Personal Trainer';
  userInitials = 'MJ';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/trainer/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'My Members',
      route: '/trainer/members',
      icon: 'members'
    },
    {
      label: 'My Schedule',
      route: '/trainer/schedule',
      icon: 'calendar'
    },
    {
      label: 'Attendance',
      route: '/trainer/attendance',
      icon: 'users'
    },
    {
      label: 'Classes',
      route: '/trainer/classes',
      icon: 'bell'
    },
    {
      label: 'Reports',
      route: '/trainer/reports',
      icon: 'chart'
    },
    {
      label: 'Profile',
      route: '/trainer/profile',
      icon: 'user'
    }
  ];
}