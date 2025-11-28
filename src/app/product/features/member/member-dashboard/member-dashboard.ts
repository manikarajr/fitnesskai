import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Layout, NavItem } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-member-dashboard',
  imports: [CommonModule, Layout],
  templateUrl: './member-dashboard.html',
  styleUrl: './member-dashboard.scss',
})
export class MemberDashboard {

navItems: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/member/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'Classes',
    route: '/member/classes',
    icon: 'calendar'
  },
  {
    label: 'Check-In',
    route: '/member/checkin',
    icon: 'bell'
  },
  {
    label: 'Profile',
    route: '/member/profile',
    icon: 'users'
  }
];

  todayClasses = [
    { id: 1, name: 'Morning HIIT', time: '06:00', duration: '60 min', trainer: 'Mike Johnson', room: 'Studio A', spots: 3 },
    { id: 2, name: 'Yoga Flow', time: '09:00', duration: '45 min', trainer: 'Sarah Lee', room: 'Studio B', spots: 5 },
    { id: 3, name: 'Strength Training', time: '17:00', duration: '60 min', trainer: 'Mike Johnson', room: 'Gym Floor', spots: 2 }
  ];

  weekSchedule = [
    { day: 'Monday', classes: ['HIIT 6AM', 'Yoga 9AM'] },
    { day: 'Tuesday', classes: ['Strength 6PM'] },
    { day: 'Wednesday', classes: ['HIIT 6AM', 'Boxing 7PM'] },
    { day: 'Thursday', classes: [] },
    { day: 'Friday', classes: ['Yoga 9AM', 'CrossFit 6PM'] },
    { day: 'Saturday', classes: ['HIIT 8AM'] },
    { day: 'Sunday', classes: [] }
  ];
}
