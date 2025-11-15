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
  features: PricingFeature[];
  adminFeatures: string[];
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
  // Using Angular 17 signals for reactive state
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
        description: 'Perfect for individual trainers just getting started',
        monthlyPrice: 0,
        yearlyPrice: 0,
        buttonText: 'Start Free',
        buttonStyle: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
        features: [
          { text: 'Up to 10 clients', included: true },
          { text: 'Basic client management', included: true },
          { text: 'Simple workout builder', included: true },
          { text: 'Progress tracking', included: true },
          { text: 'Email support', included: true },
          { text: 'Mobile app access', included: true },
          { text: 'Video coaching', included: false },
          { text: 'Digital store', included: false },
          { text: 'Custom branding', included: false },
        ],
        adminFeatures: [
          'Client profiles & notes',
          'Basic workout templates',
          'Simple scheduling',
          'Basic analytics'
        ],
        memberFeatures: [
          'View assigned workouts',
          'Log exercises',
          'Track basic progress',
          'Message trainer'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Everything you need to scale your fitness business',
        monthlyPrice: 49,
        yearlyPrice: 39,
        badge: 'MOST POPULAR',
        featured: true,
        buttonText: 'Start 14-Day Trial',
        buttonStyle: 'bg-white hover:bg-gray-100 text-red-600 font-bold transform hover:scale-105',
        features: [
          { text: 'Unlimited clients', included: true },
          { text: 'Advanced program builder', included: true },
          { text: 'AI workout generator', included: true },
          { text: 'Video coaching sessions', included: true },
          { text: 'Digital product store', included: true },
          { text: 'Community features', included: true },
          { text: 'Automated scheduling', included: true },
          { text: 'Priority support', included: true },
          { text: 'Custom branding', included: false },
        ],
        adminFeatures: [
          'Full client management suite',
          'AI-powered program builder',
          'Sell workout plans & ebooks',
          'Live video coaching',
          'Automated booking & reminders',
          'Revenue analytics dashboard',
          'Client retention tracking'
        ],
        memberFeatures: [
          'AI fitness coach access',
          'Full workout library',
          'Nutrition tracking',
          'Community challenges',
          'Progress photos & measurements',
          'Book sessions online',
          'Earn rewards & badges'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For gyms, studios, and large teams',
        monthlyPrice: 199,
        yearlyPrice: 166,
        buttonText: 'Contact Sales',
        buttonStyle: 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white',
        features: [
          { text: 'Everything in Professional', included: true },
          { text: 'Multiple trainer accounts', included: true },
          { text: 'Custom branding & domain', included: true },
          { text: 'API access', included: true },
          { text: 'Advanced integrations', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'Custom features on request', included: true },
          { text: '24/7 phone support', included: true },
          { text: 'SLA guarantee', included: true },
        ],
        adminFeatures: [
          'Multi-location management',
          'Staff permission controls',
          'Custom reporting',
          'Bulk client import',
          'Payment processing',
          'Equipment booking system',
          'Franchise support'
        ],
        memberFeatures: [
          'Access multiple trainers',
          'Premium content library',
          'VIP community access',
          'Early feature access',
          'Personalized onboarding',
          'Exclusive workshops',
          'Priority booking'
        ]
      }
    ];
  }

  private initializeFAQs(): void {
    this.faqs = [
      {
        question: 'Can I switch between plans anytime?',
        answer: 'Absolutely! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle, and we\'ll prorate any differences.',
        isOpen: false
      },
      {
        question: 'Do you take commission on my digital product sales?',
        answer: 'Never! You keep 100% of your earnings from selling workout plans, ebooks, or any digital products. We only charge the flat monthly subscription fee.',
        isOpen: false
      },
      {
        question: 'What\'s included in the 14-day free trial?',
        answer: 'You get full access to all Professional plan features for 14 days. No credit card required to start. You can explore every feature, add clients, and even start selling products.',
        isOpen: false
      },
      {
        question: 'How does the AI workout generator work?',
        answer: 'Our AI analyzes client goals, fitness levels, available equipment, and preferences to create personalized workout plans in seconds. You can customize and adjust any generated program.',
        isOpen: false
      },
      {
        question: 'Can my clients use the platform on mobile?',
        answer: 'Yes! Both trainers and clients get access to native iOS and Android apps. Clients can view workouts, track progress, and communicate with you on the go.',
        isOpen: false
      },
      {
        question: 'What kind of support do you offer?',
        answer: 'Starter plans include email support (24-hour response). Professional plans get priority support with live chat. Enterprise customers receive 24/7 phone support and a dedicated account manager.',
        isOpen: false
      }
    ];
  }

  toggleBillingCycle(): void {
    this.billingCycle.update(cycle => cycle === 'monthly' ? 'yearly' : 'monthly');
  }

  selectTier(tierId: string): void {
    this.selectedTier.set(tierId);
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