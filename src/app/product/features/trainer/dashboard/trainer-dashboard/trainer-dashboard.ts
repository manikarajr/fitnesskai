import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Layout, NavItem } from '../../../../shared/components/layout/layout';

@Component({
  selector: 'app-trainer-dashboard',
  imports: [CommonModule, Layout],
  templateUrl: './trainer-dashboard.html',
  styleUrl: './trainer-dashboard.scss',
})
export class TrainerDashboard {

navItems: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/trainer/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'My Members',
    route: '/trainer/members',
    icon: 'users'
  },
  {
    label: 'Schedule',
    route: '/trainer/schedule',
    icon: 'calendar'
  },
  {
    label: 'Attendance',
    route: '/trainer/attendance',
    icon: 'bell'
  }
];

  todaySchedule = [
    { id: 1, time: '06:00', duration: '60 min', class: 'Morning HIIT', members: 12, room: 'Studio A', status: 'completed' },
    { id: 2, time: '09:00', duration: '45 min', class: 'Strength Training', members: 8, room: 'Gym Floor', status: 'ongoing' },
    { id: 3, time: '11:00', duration: '60 min', class: 'CrossFit', members: 15, room: 'Box Area', status: 'upcoming' },
    { id: 4, time: '14:00', duration: '45 min', class: 'Yoga Flow', members: 10, room: 'Studio B', status: 'upcoming' },
    { id: 5, time: '17:00', duration: '60 min', class: 'Boxing Cardio', members: 14, room: 'Combat Zone', status: 'upcoming' }
  ];

  assignedMembers = [
    { id: 1, name: 'Sarah Johnson', initials: 'SJ', plan: 'Premium', status: 'active', lastVisit: 'Today', attendance: 92 },
    { id: 2, name: 'Mike Davis', initials: 'MD', plan: 'Elite', status: 'active', lastVisit: 'Yesterday', attendance: 88 },
    { id: 3, name: 'Emily Brown', initials: 'EB', plan: 'Basic', status: 'expiring', lastVisit: '2 days ago', attendance: 75 },
    { id: 4, name: 'David Wilson', initials: 'DW', plan: 'Premium', status: 'active', lastVisit: 'Today', attendance: 95 },
    { id: 5, name: 'Lisa Anderson', initials: 'LA', plan: 'Elite', status: 'active', lastVisit: 'Yesterday', attendance: 90 },
    { id: 6, name: 'James Taylor', initials: 'JT', plan: 'Premium', status: 'active', lastVisit: 'Today', attendance: 85 }
  ];
}
