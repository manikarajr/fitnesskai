import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  recentActivities = [
    { id: 1, type: 'new', title: 'New Member Joined', description: 'Sarah Johnson enrolled in Premium plan', time: '5 min ago' },
    { id: 2, type: 'checkin', title: 'Attendance Check-in', description: 'Mike Davis checked in for morning session', time: '12 min ago' },
    { id: 3, type: 'payment', title: 'Payment Received', description: 'John Smith paid $89 for monthly renewal', time: '23 min ago' },
    { id: 4, type: 'new', title: 'New Member Joined', description: 'Emily Brown enrolled in Basic plan', time: '1 hour ago' },
    { id: 5, type: 'checkin', title: 'Attendance Check-in', description: 'David Wilson checked in for evening session', time: '2 hours ago' }
  ];

  membershipPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 29,
      duration: 'month',
      popular: false,
      members: 89,
      features: ['Gym Access', 'Locker Room', 'Basic Equipment', 'Mobile App']
    },
    {
      id: 2,
      name: 'Premium',
      price: 59,
      duration: 'month',
      popular: true,
      members: 156,
      features: ['All Basic Features', 'Personal Trainer', 'Group Classes', 'Nutrition Plan', 'Priority Support']
    },
    {
      id: 3,
      name: 'Elite',
      price: 99,
      duration: 'month',
      popular: false,
      members: 97,
      features: ['All Premium Features', '24/7 Access', 'Spa & Sauna', 'Guest Passes', 'Diet Consultation']
    }
  ];
}