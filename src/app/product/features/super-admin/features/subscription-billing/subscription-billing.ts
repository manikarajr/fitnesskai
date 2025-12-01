import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../shared/components/data-table/data-table';
import { StatsCard } from '../../../../shared/components/stats-card/stats-card';


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
  imports: [CommonModule, FormsModule, DataTable, StatsCard],
  templateUrl: './subscription-billing.html',
  styleUrl: './subscription-billing.scss'
})
export class SubscriptionBilling implements OnInit {
  subscriptions: Subscription[] = [];
  transactions: Transaction[] = [];
  
  filterPlan = 'all';
  filterStatus = 'all';
  
  loading = false;

  // Stats
  totalRevenue = 45690;
  activeSubscriptions = 142;
  pendingPayments = 8;
  averageValue = 322;

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
      label: 'View Details',
      icon: 'view',
      color: 'primary',
      action: (sub) => this.viewSubscription(sub)
    },
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
    this.loadSubscriptions();
    this.loadTransactions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.subscriptions = [
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
      
      this.loading = false;
    }, 500);
  }

  loadTransactions(): void {
    this.transactions = [
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
}