import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { StatsCard } from '../../../../../shared/components/stats-card/stats-card';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';
import { SubscriptionPlanForm } from '../subscription-plan-form/subscription-plan-form';
import { PricingPlansService, PricingPlan } from '../pricing-plans.service';

interface Subscription {
  id: number;
  gymName: string;
  plan: string;
  amount: number;
  billingCycle: string;
  status: string;
  nextBilling: Date;
  startDate: Date;
}

interface Transaction {
  id: number;
  gymName: string;
  amount: number;
  plan: string;
  date: Date;
  status: string;
  invoice: string;
}

@Component({
  selector: 'app-subscription-billing',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    DataTable, 
    StatsCard, 
    OffcanvasPanel, 
    SubscriptionPlanForm
  ],
  templateUrl: './subscription-billing.html',
  styleUrl: './subscription-billing.scss'
})
export class SubscriptionBilling implements OnInit {
  private pricingPlansService = inject(PricingPlansService);
  
  // Convert to signals
  pricingPlans = signal<PricingPlan[]>([]);
  subscriptions = signal<Subscription[]>([]);
  transactions = signal<Transaction[]>([]);
  
  filterPlan = 'all';
  filterStatus = 'all';
  showMobileFilters = false;
  
  loading = signal(false);
  plansLoading = signal(false);

  // Mobile detection
  isMobile = false;

  // Stats
  totalRevenue = 45690;
  activeSubscriptions = 142;
  pendingPayments = 8;
  averageValue = 322;

  // Plan management
  isPlanOffcanvasOpen = false;
  selectedPlan: PricingPlan | null = null;
  isEditMode = false;

  subscriptionColumns: TableColumn[] = [
    { key: 'gymName', label: 'Gym Name', sortable: true },
    { key: 'plan', label: 'Plan', type: 'badge', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'billingCycle', label: 'Billing', sortable: true },
    { key: 'status', label: 'Status', type: 'badge', sortable: true },
    { key: 'nextBilling', label: 'Next Billing', type: 'date', sortable: true }
  ];

  transactionColumns: TableColumn[] = [
    { key: 'gymName', label: 'Gym Name', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'plan', label: 'Plan', type: 'badge' },
    { key: 'date', label: 'Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'badge', sortable: true },
    { key: 'invoice', label: 'Invoice', sortable: true }
  ];

  subscriptionActions: TableAction[] = [
    {
      label: 'Download Invoice',
      icon: 'download',
      color: 'success',
      action: (sub) => this.downloadInvoice(sub)
    }
  ];

  transactionActions: TableAction[] = [
    {
      label: 'Download',
      icon: 'download',
      color: 'primary',
      action: (txn) => this.downloadTransaction(txn)
    }
  ];

  subscriptionPagination: PaginationData = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 48,
    itemsPerPage: 10
  };

  transactionPagination: PaginationData = {
    currentPage: 1,
    totalPages: 8,
    totalItems: 76,
    itemsPerPage: 10
  };

  ngOnInit(): void {
    this.checkMobile();
    this.loadPricingPlans();
    this.loadSubscriptions();
    this.loadTransactions();

    // Listen for window resize
    window.addEventListener('resize', () => this.checkMobile());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkMobile());
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 1024;
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  loadPricingPlans(): void {
    this.plansLoading.set(true);
    
    this.pricingPlansService.getPricingPlans().subscribe({
      next: (plans) => {
        this.pricingPlans.set(plans);
        this.plansLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading pricing plans:', error);
        this.plansLoading.set(false);
      }
    });
  }

  loadSubscriptions(): void {
    this.loading.set(true);
    
    const subs: Subscription[] = [
      {
        id: 1,
        gymName: 'PowerHouse Gym',
        plan: 'Professional',
        amount: 99,
        billingCycle: 'Monthly',
        status: 'Active',
        nextBilling: new Date('2024-12-15'),
        startDate: new Date('2024-01-15')
      },
      {
        id: 2,
        gymName: 'FitZone Central',
        plan: 'Enterprise',
        amount: 299,
        billingCycle: 'Monthly',
        status: 'Active',
        nextBilling: new Date('2024-12-20'),
        startDate: new Date('2024-02-20')
      },
      {
        id: 3,
        gymName: 'Elite Fitness',
        plan: 'Professional',
        amount: 79,
        billingCycle: 'Yearly',
        status: 'Active',
        nextBilling: new Date('2025-11-10'),
        startDate: new Date('2023-11-10')
      },
      {
        id: 4,
        gymName: 'Metro Gym',
        plan: 'Professional',
        amount: 99,
        billingCycle: 'Monthly',
        status: 'Active',
        nextBilling: new Date('2024-12-05'),
        startDate: new Date('2024-03-05')
      },
      {
        id: 5,
        gymName: 'Iron Paradise',
        plan: 'Starter',
        amount: 49,
        billingCycle: 'Monthly',
        status: 'Active',
        nextBilling: new Date('2024-12-12'),
        startDate: new Date('2024-04-12')
      },
      {
        id: 6,
        gymName: 'FitZone Downtown',
        plan: 'Starter',
        amount: 49,
        billingCycle: 'Monthly',
        status: 'Pending',
        nextBilling: new Date('2024-12-28'),
        startDate: new Date('2024-11-28')
      },
      {
        id: 7,
        gymName: 'CrossFit Arena',
        plan: 'Professional',
        amount: 99,
        billingCycle: 'Monthly',
        status: 'Failed',
        nextBilling: new Date('2024-11-22'),
        startDate: new Date('2023-09-22')
      }
    ];
    
    this.subscriptions.set(subs);
    this.loading.set(false);
  }

  loadTransactions(): void {
    const txns: Transaction[] = [
      {
        id: 1,
        gymName: 'PowerHouse Gym',
        amount: 99,
        plan: 'Professional',
        date: new Date('2024-11-15'),
        status: 'Paid',
        invoice: 'INV-2024-001'
      },
      {
        id: 2,
        gymName: 'FitZone Central',
        amount: 299,
        plan: 'Enterprise',
        date: new Date('2024-11-20'),
        status: 'Paid',
        invoice: 'INV-2024-002'
      },
      {
        id: 3,
        gymName: 'Metro Gym',
        amount: 99,
        plan: 'Professional',
        date: new Date('2024-11-05'),
        status: 'Paid',
        invoice: 'INV-2024-003'
      },
      {
        id: 4,
        gymName: 'Iron Paradise',
        amount: 49,
        plan: 'Starter',
        date: new Date('2024-11-12'),
        status: 'Paid',
        invoice: 'INV-2024-004'
      },
      {
        id: 5,
        gymName: 'CrossFit Arena',
        amount: 99,
        plan: 'Professional',
        date: new Date('2024-10-22'),
        status: 'Failed',
        invoice: 'INV-2024-005'
      }
    ];
    
    this.transactions.set(txns);
  }

  viewSubscription(subscription: Subscription): void {
    console.log('View subscription:', subscription);
  }

  downloadInvoice(subscription: Subscription): void {
    console.log('Download invoice for:', subscription);
  }

  downloadTransaction(transaction: Transaction): void {
    console.log('Download transaction:', transaction);
  }

  onSubscriptionPageChange(page: number): void {
    this.subscriptionPagination.currentPage = page;
  }

  onTransactionPageChange(page: number): void {
    this.transactionPagination.currentPage = page;
  }

  openCreatePlanOffcanvas(): void {
    this.selectedPlan = null;
    this.isEditMode = false;
    this.isPlanOffcanvasOpen = true;
  }

  openEditPlanOffcanvas(plan: PricingPlan): void {
    this.selectedPlan = plan;
    this.isEditMode = true;
    this.isPlanOffcanvasOpen = true;
  }

  closePlanOffcanvas(): void {
    this.isPlanOffcanvasOpen = false;
    this.selectedPlan = null;
    this.isEditMode = false;
  }

  savePlan(plan: PricingPlan): void {
    const currentPlans = this.pricingPlans();
    
    if (this.isEditMode && this.selectedPlan && this.selectedPlan.id) {
      this.pricingPlansService.updatePlan({ 
        ...plan, 
        id: this.selectedPlan.id, 
        activeCount: this.selectedPlan.activeCount 
      }).subscribe({
        next: (updatedPlan) => {
          const index = currentPlans.findIndex(p => p.id === this.selectedPlan!.id);
          if (index !== -1) {
            const updated = [...currentPlans];
            updated[index] = updatedPlan;
            this.pricingPlans.set(updated);
          }
          console.log('Plan updated:', updatedPlan);
          this.closePlanOffcanvas();
        },
        error: (error) => {
          console.error('Error updating plan:', error);
        }
      });
    } else {
      const maxId = currentPlans.length > 0 
        ? Math.max(...currentPlans.map(p => p.id || 0)) 
        : 0;
      
      const newPlan: PricingPlan = {
        ...plan,
        id: maxId + 1,
        activeCount: 0
      };
      
      this.pricingPlansService.createPlan(newPlan).subscribe({
        next: (createdPlan) => {
          this.pricingPlans.set([...currentPlans, createdPlan]);
          console.log('Plan created:', createdPlan);
          this.closePlanOffcanvas();
        },
        error: (error) => {
          console.error('Error creating plan:', error);
        }
      });
    }
  }

  deletePlan(plan: PricingPlan): void {
    if (!plan.id) {
      console.error('Cannot delete plan without id');
      return;
    }

    if (confirm(`Are you sure you want to delete the "${plan.name}" plan? This action cannot be undone.`)) {
      this.pricingPlansService.deletePlan(plan.id).subscribe({
        next: () => {
          const currentPlans = this.pricingPlans();
          this.pricingPlans.set(currentPlans.filter(p => p.id !== plan.id));
          console.log('Plan deleted:', plan);
        },
        error: (error) => {
          console.error('Error deleting plan:', error);
        }
      });
    }
  }

  getBadgeColor(activeCount: number): string {
    if (activeCount >= 70) return 'green';
    if (activeCount >= 40) return 'blue';
    return 'purple';
  }
}