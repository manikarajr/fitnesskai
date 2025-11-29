import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  featured?: boolean;
  isCurrent?: boolean;
  features: PricingFeature[];
  adminFeatures: string[];
  trainerFeatures: string[];
  memberFeatures: string[];
  buttonText: string;
  buttonStyle: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  billingCycle = signal<'monthly' | 'yearly'>('monthly');
  selectedTier = signal<string>('professional');
  
  pricingTiers: PricingTier[] = [];
  faqs: FAQ[] = [];
  
  constructor(private sanitizer: DomSanitizer) {
    this.initializePricing();
    this.initializeFAQs();
  }

  private initializePricing(): void {
    this.pricingTiers = [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small gyms getting started',
        monthlyPrice: 49,
        yearlyPrice: 39,
        isCurrent: true,
        badge: 'CURRENT PLAN',
        buttonText: 'Your Current Plan',
        buttonStyle: 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed',
        features: [
          { text: '1 gym location', included: true },
          { text: 'Up to 5 trainers', included: true },
          { text: 'Up to 100 members', included: true },
          { text: 'Community feed', included: true },
          { text: 'Image & video posts', included: true },
          { text: 'Email support', included: true },
        ],
        adminFeatures: [
          'Gym profile management',
          'Add & manage trainers (up to 5)',
          'Add & manage members (up to 100)',
          'View community feed activity',
          'Basic analytics dashboard',
          'Member attendance tracking'
        ],
        trainerFeatures: [
          'Create workout plans',
          'Assign workouts to members',
          'Track member progress',
          'Post images & videos to feed',
          'Comment & like posts',
          'Message members'
        ],
        memberFeatures: [
          'View community feed',
          'Post images & videos',
          'Like & comment on posts',
          'Follow other members',
          'View assigned workouts',
          'Track workout history',
          'Message trainers'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'For growing fitness businesses',
        monthlyPrice: 99,
        yearlyPrice: 79,
        badge: 'MOST POPULAR',
        featured: true,
        buttonText: 'Upgrade to Professional',
        buttonStyle: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
        features: [
          { text: 'Up to 3 gym locations', included: true },
          { text: 'Up to 15 trainers', included: true },
          { text: 'Up to 500 members', included: true },
          { text: 'Community feed with HD media', included: true },
          { text: 'Priority support', included: true },
          { text: 'Advanced analytics', included: true },
        ],
        adminFeatures: [
          'Everything in Starter',
          'Manage multiple locations (up to 3)',
          'Extended trainer capacity (15)',
          'Extended member capacity (500)',
          'Advanced analytics & reports',
          'Community feed moderation tools',
          'Custom branding options'
        ],
        trainerFeatures: [
          'Everything in Starter',
          'Advanced workout templates',
          'Post HD videos to feed',
          'Tag members in posts',
          'Trainer performance analytics',
          'Group workout sessions'
        ],
        memberFeatures: [
          'Everything in Starter',
          'Post HD images & videos',
          'Tag trainers in posts',
          'Advanced workout analytics',
          'Achievement tracking',
          'Progress photos'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For gym chains & franchises',
        monthlyPrice: 299,
        yearlyPrice: 249,
        buttonText: 'Contact Sales',
        buttonStyle: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200',
        features: [
          { text: 'Unlimited gym locations', included: true },
          { text: 'Unlimited trainers', included: true },
          { text: 'Unlimited members', included: true },
          { text: 'Enterprise community platform', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: '24/7 priority support', included: true },
        ],
        adminFeatures: [
          'Everything in Professional',
          'Unlimited locations, trainers & members',
          'Multi-location dashboard',
          'Cross-location analytics',
          'Advanced permission controls',
          'API access for integrations',
          'Dedicated account manager'
        ],
        trainerFeatures: [
          'Everything in Professional',
          'Work across multiple locations',
          'Collaboration with other trainers',
          'Enterprise workout library',
          'Advanced member insights'
        ],
        memberFeatures: [
          'Everything in Professional',
          'Access all gym locations',
          'Cross-location check-ins',
          'Premium community features',
          'Priority support access'
        ]
      }
    ];
  }

  private initializeFAQs(): void {
    this.faqs = [
      {
        question: 'How does the three-panel system work?',
        answer: 'Our platform includes three interconnected modules: Admin Panel (for gym owners to manage locations, trainers, and members), Trainer Panel (for trainers to create workouts and coach members), and Member Panel (for members to track workouts, post to community feed, and communicate). All three work seamlessly together.',
        isOpen: false
      },
      {
        question: 'What can members post on the community feed?',
        answer: 'All plans include a community feed where members can post images and videos, like and comment on posts, and follow other members. Professional plans add HD video support and advanced social features.',
        isOpen: false
      },
      {
        question: 'Can I switch between plans anytime?',
        answer: 'Absolutely! You can upgrade or downgrade your subscription at any time. Changes take effect at the next billing cycle, and we\'ll prorate any differences. Your data, including all community posts and workout history, is always preserved.',
        isOpen: false
      },
      {
        question: 'How do trainer and member limits work?',
        answer: 'The Starter plan supports up to 5 trainers and 100 members. Professional increases this to 15 trainers and 500 members. Enterprise removes all limits entirely, perfect for gym chains and franchises.',
        isOpen: false
      },
      {
        question: 'Can trainers and members use the platform on mobile?',
        answer: 'Yes! All three panels (Admin, Trainer, and Member) are fully responsive and work on any device. Members can post to the community feed, view workouts, and track progress on the go. Trainers can coach and manage clients from anywhere.',
        isOpen: false
      },
      {
        question: 'What support is included with each plan?',
        answer: 'Starter includes email support. Professional adds priority support with faster response times. Enterprise includes 24/7 priority support and a dedicated account manager to help you succeed.',
        isOpen: false
      }
    ];
  }

  toggleBillingCycle(): void {
    this.billingCycle.update(cycle => cycle === 'monthly' ? 'yearly' : 'monthly');
  }

  selectTier(tierId: string): void {
    if (tierId === 'starter' && this.pricingTiers.find(t => t.id === tierId)?.isCurrent) return;
    this.selectedTier.set(tierId);
    console.log(`Selected tier: ${tierId}`);
  }

  toggleFAQ(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  getPrice(tier: PricingTier): number {
    return this.billingCycle() === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  }

  getSavings(tier: PricingTier): number {
    if (tier.monthlyPrice === 0) return 0;
    return (tier.monthlyPrice * 12) - (tier.yearlyPrice * 12);
  }

  getCheckIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    `);
  }

  getXIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    `);
  }
}