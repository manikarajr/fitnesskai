import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-dashboard.html',
  styleUrl: './member-dashboard.scss',
})
export class MemberDashboard {
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