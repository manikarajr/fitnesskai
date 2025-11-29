import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  stats = [
    { value: '10K+', label: 'Active Gyms' },
    { value: '500K+', label: 'Members' },
    { value: '99%', label: 'Satisfaction' }
  ];
}