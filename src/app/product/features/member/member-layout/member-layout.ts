import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout, NavItem } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [RouterOutlet, Layout],
  templateUrl: './member-layout.html',
  styleUrl: './member-layout.scss',
})
export class MemberLayout {
  userName = 'Alex Thompson';
  userRole = 'Premium Member';
  userInitials = 'AT';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/member/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'My Classes',
      route: '/member/classes',
      icon: 'calendar'
    },
    {
      label: 'Check-In',
      route: '/member/checkin',
      icon: 'bell'
    },
    {
      label: 'Attendance History',
      route: '/member/attendance',
      icon: 'chart'
    },
    {
      label: 'My Trainer',
      route: '/member/trainer',
      icon: 'trainers'
    },
    {
      label: 'Membership',
      route: '/member/membership',
      icon: 'creditcard'
    },
    {
      label: 'My Profile',
      route: '/member/profile',
      icon: 'user'
    }
  ];
}