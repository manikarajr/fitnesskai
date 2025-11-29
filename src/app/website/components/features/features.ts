import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Feature {
  icon: SafeHtml;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  features: Feature[] = [];

  constructor(private sanitizer: DomSanitizer) {
    this.initializeFeatures();
  }

  private initializeFeatures(): void {
    this.features = [
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        `),
        title: 'Lightning Fast Setup',
        description: 'Get your entire fitness business online in under 5 minutes. No technical skills needed - we handle everything for you.',
        color: 'red'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        `),
        title: 'Bank-Level Security',
        description: 'Your data and your clients\' information are protected with enterprise-grade encryption and security measures.',
        color: 'blue'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `),
        title: 'Keep 100% of Your Earnings',
        description: 'No commission fees on your sales. Sell unlimited products and keep every dollar you earn.',
        color: 'green'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
        `),
        title: 'Works Everywhere',
        description: 'Access from any device - phone, tablet, or computer. Your business is always with you, wherever you go.',
        color: 'purple'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        `),
        title: 'Custom Workout Plans',
        description: 'Create and assign personalized workout plans with advanced templates and exercise libraries.',
        color: 'indigo'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        `),
        title: 'Progress Tracking',
        description: 'Track member progress, workout history, and performance analytics in real-time.',
        color: 'orange'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        `),
        title: 'Community Features',
        description: 'Build an engaged community with social feeds, member interactions, and achievement sharing.',
        color: 'pink'
      },
      {
        icon: this.createSafeHtml(`
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        `),
        title: 'Direct Messaging',
        description: 'Enable seamless communication between trainers and members for personalized coaching support.',
        color: 'teal'
      }
    ];
  }

  private createSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getColorClasses(color: string): { bg: string; text: string; bgDark: string; textDark: string } {
    const colorMap: { [key: string]: { bg: string; text: string; bgDark: string; textDark: string } } = {
      red: { bg: 'bg-red-100', text: 'text-red-600', bgDark: 'dark:bg-red-900/30', textDark: 'dark:text-red-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', bgDark: 'dark:bg-blue-900/30', textDark: 'dark:text-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-600', bgDark: 'dark:bg-green-900/30', textDark: 'dark:text-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', bgDark: 'dark:bg-purple-900/30', textDark: 'dark:text-purple-500' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', bgDark: 'dark:bg-indigo-900/30', textDark: 'dark:text-indigo-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', bgDark: 'dark:bg-orange-900/30', textDark: 'dark:text-orange-500' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', bgDark: 'dark:bg-pink-900/30', textDark: 'dark:text-pink-500' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', bgDark: 'dark:bg-teal-900/30', textDark: 'dark:text-teal-500' }
    };
    return colorMap[color] || colorMap['red'];
  }
}