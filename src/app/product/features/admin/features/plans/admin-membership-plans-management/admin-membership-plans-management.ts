// src/app/features/admin/features/plans/admin-membership-plans-management/admin-membership-plans-management.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  durationType: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  features: string;
  maxMembers: number | null; // null means unlimited
  status: 'active' | 'inactive';
  totalSubscribers: number;
  popularPlan: boolean;
  createdAt: Date;
}

interface PlanFilters {
  search: string;
  status: string;
  durationType: string;
}

@Component({
  selector: 'app-admin-membership-plans-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './admin-membership-plans-management.html',
  styleUrl: './admin-membership-plans-management.scss',
})
export class AdminMembershipPlansManagement implements OnInit {
  // Signals for reactive state
  plans = signal<MembershipPlan[]>([]);
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  isEditMode = signal(false);
  selectedPlan = signal<MembershipPlan | null>(null);
  
  // Filter signals
  searchFilter = signal('');
  statusFilter = signal('');
  durationTypeFilter = signal('');
  
  // Sort signals
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Gym owner info
  gymName = signal('Downtown Fitness Center');

  // Computed filtered and sorted plans
  filteredPlans = computed(() => {
    let filtered = [...this.plans()];

    // Apply search filter
    const search = this.searchFilter().toLowerCase();
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    const status = this.statusFilter();
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    // Apply duration type filter
    const durationType = this.durationTypeFilter();
    if (durationType) {
      filtered = filtered.filter(p => p.durationType === durationType);
    }

    // Apply sorting
    const key = this.sortKey();
    if (key) {
      filtered.sort((a, b) => {
        const aVal = a[key as keyof MembershipPlan];
        const bVal = b[key as keyof MembershipPlan];
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;
        
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  });

  // Computed stats for dashboard
  activePlansCount = computed(() => {
    return this.plans().filter(p => p.status === 'active').length;
  });

  totalSubscribersCount = computed(() => {
    return this.plans().reduce((sum, p) => sum + p.totalSubscribers, 0);
  });

  totalRevenueMonthly = computed(() => {
    return this.plans().reduce((sum, p) => {
      const monthlyRate = this.getMonthlyRate(p);
      return sum + (monthlyRate * p.totalSubscribers);
    }, 0);
  });

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Plan Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true, type: 'currency' },
    { key: 'durationType', label: 'Duration', sortable: true, type: 'badge' },
    { key: 'totalSubscribers', label: 'Subscribers', sortable: true },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  ];

  tableActions: TableAction[] = [
    { label: 'Edit', icon: 'edit', color: 'primary', action: (row) => this.editPlan(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deletePlan(row) }
  ];

  paginationConfig = { enabled: true, itemsPerPage: 10 };

  // Form
  planForm!: FormGroup;

  // Non-reactive properties for form binding
  filters: PlanFilters = { search: '', status: '', durationType: '' };

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  initForm(): void {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      durationType: ['monthly', Validators.required],
      features: ['', Validators.required],
      maxMembers: [null],
      popularPlan: [false],
      status: ['active', Validators.required]
    });
  }

  loadPlans(): void {
    this.loading.set(true);

    // Mock data for gym membership plans
    const planData: MembershipPlan[] = [
      {
        id: '1',
        name: 'Basic Membership',
        description: 'Perfect for beginners starting their fitness journey',
        price: 29.99,
        duration: 1,
        durationType: 'monthly',
        features: 'Gym access, Locker room, Basic equipment',
        maxMembers: null,
        status: 'active',
        totalSubscribers: 145,
        popularPlan: false,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Premium Membership',
        description: 'Our most popular plan with full gym access',
        price: 49.99,
        duration: 1,
        durationType: 'monthly',
        features: 'Full gym access, Group classes, Locker room, Personal trainer consultation',
        maxMembers: null,
        status: 'active',
        totalSubscribers: 287,
        popularPlan: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Elite Membership',
        description: 'Premium experience with exclusive perks',
        price: 79.99,
        duration: 1,
        durationType: 'monthly',
        features: 'All Premium features, Unlimited personal training, Spa access, Nutrition coaching',
        maxMembers: 50,
        status: 'active',
        totalSubscribers: 42,
        popularPlan: false,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '4',
        name: 'Quarterly Basic',
        description: 'Save 10% with quarterly payment',
        price: 80.97,
        duration: 3,
        durationType: 'quarterly',
        features: 'Gym access, Locker room, Basic equipment',
        maxMembers: null,
        status: 'active',
        totalSubscribers: 68,
        popularPlan: false,
        createdAt: new Date('2024-02-01')
      },
      {
        id: '5',
        name: 'Annual Premium',
        description: 'Best value - Save 20% with annual payment',
        price: 479.99,
        duration: 12,
        durationType: 'yearly',
        features: 'Full gym access, Group classes, Locker room, Personal trainer consultation',
        maxMembers: null,
        status: 'active',
        totalSubscribers: 156,
        popularPlan: false,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '6',
        name: 'Student Plan',
        description: 'Special discount for students',
        price: 24.99,
        duration: 1,
        durationType: 'monthly',
        features: 'Gym access, Locker room, Group classes',
        maxMembers: 100,
        status: 'active',
        totalSubscribers: 89,
        popularPlan: false,
        createdAt: new Date('2024-03-01')
      },
      {
        id: '7',
        name: 'Corporate Plan',
        description: 'Exclusive plan for corporate partners',
        price: 39.99,
        duration: 1,
        durationType: 'monthly',
        features: 'Full gym access, Group classes, Wellness programs',
        maxMembers: null,
        status: 'inactive',
        totalSubscribers: 0,
        popularPlan: false,
        createdAt: new Date('2024-04-01')
      }
    ];

    setTimeout(() => {
      this.plans.set(planData);
      this.loading.set(false);
    }, 500);
  }

  getMonthlyRate(plan: MembershipPlan): number {
    return plan.price / plan.duration;
  }

  applyFilters(): void {
    this.searchFilter.set(this.filters.search);
    this.statusFilter.set(this.filters.status);
    this.durationTypeFilter.set(this.filters.durationType);
  }

  resetFilters(): void {
    this.filters = { search: '', status: '', durationType: '' };
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.durationTypeFilter.set('');
  }

  openAddPlanPanel(): void {
    this.isEditMode.set(false);
    this.selectedPlan.set(null);
    this.planForm.reset({ 
      status: 'active',
      durationType: 'monthly',
      popularPlan: false,
      maxMembers: null
    });
    this.isPanelOpen.set(true);
  }

  viewPlan(plan: MembershipPlan): void {
    console.log('View plan:', plan);
    // Implement view details logic
  }

  editPlan(plan: MembershipPlan): void {
    this.isEditMode.set(true);
    this.selectedPlan.set(plan);
    this.planForm.patchValue(plan);
    this.isPanelOpen.set(true);
  }

  deletePlan(plan: MembershipPlan): void {
    if (plan.totalSubscribers > 0) {
      alert(`Cannot delete ${plan.name}. This plan has ${plan.totalSubscribers} active subscribers.\n\nPlease migrate subscribers to another plan first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete ${plan.name}?`)) {
      this.loading.set(true);
      
      setTimeout(() => {
        const updatedPlans = this.plans().filter(p => p.id !== plan.id);
        this.plans.set(updatedPlans);
        this.loading.set(false);
      }, 500);
    }
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.planForm.reset();
    this.selectedPlan.set(null);
  }

  onSubmit(): void {
    if (this.planForm.invalid) return;

    this.submitting.set(true);
    const formData = this.planForm.value;

    const planData: MembershipPlan = {
      id: this.isEditMode() ? this.selectedPlan()!.id : Date.now().toString(),
      ...formData,
      totalSubscribers: this.isEditMode() ? this.selectedPlan()!.totalSubscribers : 0,
      createdAt: this.isEditMode() ? this.selectedPlan()!.createdAt : new Date()
    };

    setTimeout(() => {
      if (this.isEditMode()) {
        const updatedPlans = this.plans().map(p => 
          p.id === planData.id ? planData : p
        );
        this.plans.set(updatedPlans);
      } else {
        this.plans.set([planData, ...this.plans()]);
      }

      this.submitting.set(false);
      this.closePanel();
    }, 1000);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
  }

  onRowSelect(selectedRows: MembershipPlan[]): void {
    console.log('Selected rows:', selectedRows);
  }
}