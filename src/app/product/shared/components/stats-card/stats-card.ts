import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})
export class StatsCard {
 @Input() label = '';
  @Input() value: string | number = 0;
  @Input() change?: number;
  @Input() icon: 'building' | 'users' | 'currency' | 'chart' | 'check' | 'clock' = 'chart';
  @Input() color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'indigo' = 'red';

  getBorderColor(): string {
    const colors = {
      red: 'border-red-500',
      blue: 'border-blue-500',
      green: 'border-green-500',
      yellow: 'border-yellow-500',
      purple: 'border-purple-500',
      indigo: 'border-indigo-500'
    };
    return colors[this.color];
  }

  getIconBgColor(): string {
    const colors = {
      red: 'bg-gradient-to-br from-red-500 to-red-600',
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
      indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    };
    return colors[this.color];
  }
}
