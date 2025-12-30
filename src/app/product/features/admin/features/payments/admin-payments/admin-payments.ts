import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataTable, PaginationConfig, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface Payment {
  id: string;
  transactionId: string;
  memberId: string;
  memberName: string;
  membershipType: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'bank';
  status: 'completed' | 'pending' | 'failed';
  paymentDate: Date;
  notes?: string;
}

interface Member {
  id: string;
  name: string;
  membershipType: string;
}

interface Filters {
  search: string;
  status: string;
  method: string;
  period: string;
}

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTable, OffcanvasPanel],
  templateUrl: './admin-payments.html',
  styleUrl: './admin-payments.scss',
})
export class AdminPayments implements OnInit {
  private allPayments = signal<Payment[]>([]);
  filters = signal<Filters>({ search: '', status: '', method: '', period: '' });
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);

  activeMembers = signal<Member[]>([
    { id: '1', name: 'Alex Johnson', membershipType: 'premium' },
    { id: '2', name: 'Emma Williams', membershipType: 'vip' },
    { id: '3', name: 'Oliver Smith', membershipType: 'basic' },
    { id: '4', name: 'Sophia Brown', membershipType: 'premium' },
    { id: '5', name: 'Liam Davis', membershipType: 'vip' }
  ]);

  todayRevenue = computed(() => {
    const today = new Date().toDateString();
    return this.allPayments()
      .filter(p => new Date(p.paymentDate).toDateString() === today && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  });

  monthRevenue = computed(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return this.allPayments()
      .filter(p => new Date(p.paymentDate) >= monthAgo && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  });

  pendingPayments = computed(() => 
    this.allPayments().filter(p => p.status === 'pending').length
  );

  failedPayments = computed(() => 
    this.allPayments().filter(p => p.status === 'failed').length
  );

  paginationConfig = signal<PaginationConfig>({
    enabled: true,
    itemsPerPage: 8
  });

  filteredPayments = computed(() => {
    let filtered = [...this.allPayments()];
    const currentFilters = this.filters();

    if (currentFilters.search) {
      const search = currentFilters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.memberName.toLowerCase().includes(search) ||
        p.transactionId.toLowerCase().includes(search)
      );
    }

    if (currentFilters.status) {
      filtered = filtered.filter(p => p.status === currentFilters.status);
    }

    if (currentFilters.method) {
      filtered = filtered.filter(p => p.method === currentFilters.method);
    }

    if (currentFilters.period) {
      const now = new Date();
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        switch (currentFilters.period) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  });

  columns: TableColumn[] = [
    { key: 'transactionId', label: 'Transaction ID', sortable: true, width: '150px' },
    { key: 'memberName', label: 'Member', sortable: true, width: '200px' },
    { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
    { key: 'method', label: 'Method', sortable: true, type: 'badge' },
    { key: 'paymentDate', label: 'Date', sortable: true, type: 'date' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' }
  ];

  tableActions: TableAction[] = [
    { label: 'View', icon: 'view', color: 'success', action: (row) => this.viewPayment(row) },
    { label: 'Receipt', icon: 'edit', color: 'primary', action: (row) => this.generateReceipt(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deletePayment(row) }
  ];

  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      memberId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      method: ['cash', Validators.required],
      status: ['completed', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      transactionId: [''],
      notes: ['']
    });
  }

  loadMockData(): void {
    this.loading.set(true);

    const mockPayments: Payment[] = [
      {
        id: '1',
        transactionId: 'TXN001',
        memberId: '1',
        memberName: 'Alex Johnson',
        membershipType: 'premium',
        amount: 59,
        method: 'card',
        status: 'completed',
        paymentDate: new Date()
      },
      {
        id: '2',
        transactionId: 'TXN002',
        memberId: '2',
        memberName: 'Emma Williams',
        membershipType: 'vip',
        amount: 99,
        method: 'upi',
        status: 'completed',
        paymentDate: new Date()
      },
      {
        id: '3',
        transactionId: 'TXN003',
        memberId: '3',
        memberName: 'Oliver Smith',
        membershipType: 'basic',
        amount: 29,
        method: 'cash',
        status: 'completed',
        paymentDate: new Date(new Date().setDate(new Date().getDate() - 1))
      },
      {
        id: '4',
        transactionId: 'TXN004',
        memberId: '4',
        memberName: 'Sophia Brown',
        membershipType: 'premium',
        amount: 59,
        method: 'bank',
        status: 'pending',
        paymentDate: new Date()
      },
      {
        id: '5',
        transactionId: 'TXN005',
        memberId: '5',
        memberName: 'Liam Davis',
        membershipType: 'vip',
        amount: 99,
        method: 'card',
        status: 'failed',
        paymentDate: new Date(new Date().setDate(new Date().getDate() - 2))
      }
    ];

    setTimeout(() => {
      this.allPayments.set(mockPayments);
      this.loading.set(false);
    }, 500);
  }

  updateFilter(key: keyof Filters, value: string): void {
    this.filters.update(current => ({ ...current, [key]: value }));
  }

  resetFilters(): void {
    this.filters.set({ search: '', status: '', method: '', period: '' });
  }

  openAddPaymentPanel(): void {
    this.initForm();
    this.isPanelOpen.set(true);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.paymentForm.reset();
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) return;

    this.submitting.set(true);
    const formData = this.paymentForm.value;
    const member = this.activeMembers().find(m => m.id === formData.memberId);

    const newPayment: Payment = {
      id: Date.now().toString(),
      transactionId: formData.transactionId || `TXN${Date.now()}`,
      memberId: formData.memberId,
      memberName: member?.name || '',
      membershipType: member?.membershipType || '',
      amount: formData.amount,
      method: formData.method,
      status: formData.status,
      paymentDate: new Date(formData.paymentDate),
      notes: formData.notes
    };

    setTimeout(() => {
      this.allPayments.update(current => [newPayment, ...current]);
      this.submitting.set(false);
      this.closePanel();
    }, 1000);
  }

  viewPayment(payment: Payment): void {
    console.log('View payment:', payment);
  }

  generateReceipt(payment: Payment): void {
    console.log('Generate receipt for:', payment);
    alert(`Receipt generated for ${payment.transactionId}`);
  }

  deletePayment(payment: Payment): void {
    if (confirm(`Delete payment ${payment.transactionId}?`)) {
      this.allPayments.update(current => current.filter(p => p.id !== payment.id));
    }
  }

  onPageChange(page: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort:', event);
  }

  onRowSelect(selectedRows: Payment[]): void {
    console.log('Selected rows:', selectedRows);
  }
}