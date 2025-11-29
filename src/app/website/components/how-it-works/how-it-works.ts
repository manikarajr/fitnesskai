import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks implements AfterViewInit {
  @ViewChild('stepsContainer') stepsContainer!: ElementRef;
  
  currentStep = 0;
  showDashboard = false;

  steps = [
    {
      number: 1,
      title: 'Choose Your Plan',
      description: 'Browse our pricing section and select a subscription plan that fits your fitness goals and budget.',
      iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    },
    {
      number: 2,
      title: 'Complete Registration',
      description: 'Fill out the registration form with your details to create your account and activate your chosen plan.',
      iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
    },
    {
      number: 3,
      title: 'Receive Login Details',
      description: 'Check your email for your username and password. Use these credentials to log in to your dashboard.',
      iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      number: 4,
      title: 'Access Your Dashboard',
      description: 'Log in with your credentials and start your fitness journey with all the tools and features you need.',
      iconPath: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
    }
  ];

  dashboardFeatures = [
    'Track your progress and achievements',
    'Manage clients and workout plans (Trainers)',
    'Access personalized training programs',
    'Connect with your fitness community'
  ];

  ngAfterViewInit() {
    this.setupScrollSnap();
  }

  setupScrollSnap() {
    const container = this.stepsContainer?.nativeElement;
    if (!container) return;

    container.addEventListener('scroll', () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.firstElementChild?.offsetWidth || 0;
      this.currentStep = Math.round(scrollLeft / cardWidth);
    });
  }

  scrollToStep(index: number) {
    const container = this.stepsContainer?.nativeElement;
    if (!container) return;

    const cardWidth = container.firstElementChild?.offsetWidth || 0;
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  }

  toggleDashboard() {
    this.showDashboard = !this.showDashboard;
  }
}