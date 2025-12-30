// src/app/features/admin/members/admin-member-management/admin-member-management.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, PaginationConfig, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';


interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'expired';
  joinDate: Date;
  expiryDate?: Date;
  lastVisit?: Date;
  avatar?: string;
  emergencyContact?: string;
  address?: string;
  notes?: string;
}

interface Filters {
  search: string;
  membership: string;
  status: string;
}

@Component({
  selector: 'app-admin-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './admin-member-management.html',
  styleUrl: './admin-member-management.scss',
})
export class AdminMemberManagement implements OnInit {
  // Signals for reactive state
  private allMembers = signal<Member[]>([]);
  filters = signal<Filters>({ search: '', membership: '', status: '' });
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  isEditMode = signal(false);
  selectedMember = signal<Member | null>(null);
  
  // Stats signals
  totalMembers = computed(() => this.allMembers().length);
  activeMembers = computed(() => this.allMembers().filter(m => m.status === 'active').length);
  expiringSoon = computed(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.allMembers().filter(m => 
      m.expiryDate && 
      m.expiryDate <= thirtyDaysFromNow && 
      m.expiryDate > new Date() &&
      m.status === 'active'
    ).length;
  });
  
  // Pagination and sorting signals
  currentPage = signal(1);
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Pagination configuration signal
  paginationConfig = signal<PaginationConfig>({
    enabled: true,
    itemsPerPage: 8
  });

  // Computed filtered and sorted members
  filteredMembers = computed(() => {
    let filtered = [...this.allMembers()];
    const currentFilters = this.filters();

    // Apply search filter
    if (currentFilters.search) {
      const search = currentFilters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(search) || 
        m.email.toLowerCase().includes(search) ||
        m.phone.toLowerCase().includes(search)
      );
    }

    // Apply membership filter
    if (currentFilters.membership) {
      filtered = filtered.filter(m => m.membershipType === currentFilters.membership);
    }

    // Apply status filter
    if (currentFilters.status) {
      filtered = filtered.filter(m => m.status === currentFilters.status);
    }

    // Apply sorting
    const key = this.sortKey();
    if (key) {
      filtered.sort((a, b) => {
        const aValue = a[key as keyof Member];
        const bValue = b[key as keyof Member];

        if (aValue === undefined || bValue === undefined) return 0;

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  });

  // Table configuration
  columns: TableColumn[] = [
    { key: 'avatar', label: 'Member', sortable: true, type: 'avatar', width: '280px' },
    { key: 'membershipType', label: 'Plan', sortable: true, type: 'badge' },
    { key: 'joinDate', label: 'Join Date', sortable: true, type: 'date' },
    { key: 'expiryDate', label: 'Expiry', sortable: true, type: 'date' },
    { key: 'lastVisit', label: 'Last Visit', sortable: true, type: 'date' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  ];

  tableActions: TableAction[] = [
    { label: 'View', icon: 'view', color: 'success', action: (row) => this.viewMember(row) },
    { label: 'Edit', icon: 'edit', color: 'primary', action: (row) => this.editMember(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deleteMember(row) }
  ];

  memberForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  initForm(): void {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      membershipType: ['basic', Validators.required],
      status: ['active', Validators.required],
      joinDate: [new Date().toISOString().split('T')[0], Validators.required],
      expiryDate: [''],
      emergencyContact: [''],
      address: [''],
      notes: ['']
    });
  }

  loadMockData(): void {
    this.loading.set(true);

    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex.j@email.com',
        phone: '+1 (555) 100-1001',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-15'),
        lastVisit: new Date('2024-12-28'),
        avatar: '',
        emergencyContact: '+1 (555) 100-1002',
        address: '123 Main St, City, State 12345'
      },
      {
        id: '2',
        name: 'Emma Williams',
        email: 'emma.w@email.com',
        phone: '+1 (555) 200-2001',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-02-01'),
        lastVisit: new Date('2024-12-29'),
        avatar: ''
      },
      {
        id: '3',
        name: 'Oliver Smith',
        email: 'oliver.s@email.com',
        phone: '+1 (555) 300-3001',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-03-10'),
        expiryDate: new Date('2025-03-10'),
        lastVisit: new Date('2024-12-27'),
        avatar: ''
      },
      {
        id: '4',
        name: 'Sophia Brown',
        email: 'sophia.b@email.com',
        phone: '+1 (555) 400-4001',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-04-20'),
        expiryDate: new Date('2025-01-05'),
        lastVisit: new Date('2024-12-30'),
        avatar: ''
      },
      {
        id: '5',
        name: 'Liam Davis',
        email: 'liam.d@email.com',
        phone: '+1 (555) 500-5001',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2023-12-01'),
        expiryDate: new Date('2024-12-31'),
        lastVisit: new Date('2024-12-26'),
        avatar: ''
      },
      {
        id: '6',
        name: 'Ava Martinez',
        email: 'ava.m@email.com',
        phone: '+1 (555) 600-6001',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-05-15'),
        expiryDate: new Date('2025-05-15'),
        lastVisit: new Date('2024-12-29'),
        avatar: ''
      },
      {
        id: '7',
        name: 'Noah Garcia',
        email: 'noah.g@email.com',
        phone: '+1 (555) 700-7001',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-06-01'),
        expiryDate: new Date('2025-06-01'),
        lastVisit: new Date('2024-12-30'),
        avatar: ''
      },
      {
        id: '8',
        name: 'Isabella Taylor',
        email: 'isabella.t@email.com',
        phone: '+1 (555) 800-8001',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-07-10'),
        expiryDate: new Date('2025-07-10'),
        lastVisit: new Date('2024-12-28'),
        avatar: ''
      },
      {
        id: '9',
        name: 'Ethan Anderson',
        email: 'ethan.a@email.com',
        phone: '+1 (555) 900-9001',
        membershipType: 'basic',
        status: 'inactive',
        joinDate: new Date('2024-08-01'),
        expiryDate: new Date('2024-11-01'),
        lastVisit: new Date('2024-10-25'),
        avatar: ''
      },
      {
        id: '10',
        name: 'Mia Wilson',
        email: 'mia.w@email.com',
        phone: '+1 (555) 101-1011',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-09-15'),
        expiryDate: new Date('2025-09-15'),
        lastVisit: new Date('2024-12-29'),
        avatar: ''
      },
      {
        id: '11',
        name: 'Lucas Moore',
        email: 'lucas.m@email.com',
        phone: '+1 (555) 111-1111',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-10-01'),
        expiryDate: new Date('2025-10-01'),
        lastVisit: new Date('2024-12-30'),
        avatar: ''
      },
      {
        id: '12',
        name: 'Charlotte Lee',
        email: 'charlotte.l@email.com',
        phone: '+1 (555) 121-1211',
        membershipType: 'basic',
        status: 'expired',
        joinDate: new Date('2023-11-01'),
        expiryDate: new Date('2024-11-01'),
        lastVisit: new Date('2024-10-30'),
        avatar: ''
      }
    ];

    setTimeout(() => {
      this.allMembers.set(mockMembers);
      this.loading.set(false);
    }, 500);
  }

  updateFilter(key: keyof Filters, value: string): void {
    this.filters.update(current => ({ ...current, [key]: value }));
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.filters.set({ search: '', membership: '', status: '' });
    this.currentPage.set(1);
  }

  openAddMemberPanel(): void {
    this.isEditMode.set(false);
    this.selectedMember.set(null);
    this.memberForm.reset({
      membershipType: 'basic',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
    this.isPanelOpen.set(true);
  }

  viewMember(member: Member): void {
    // You can implement a view-only modal or navigate to detail page
    console.log('View member:', member);
    // For now, we'll just open edit mode in read-only
    this.editMember(member);
  }

  editMember(member: Member): void {
    this.isEditMode.set(true);
    this.selectedMember.set(member);
    this.memberForm.patchValue({
      ...member,
      joinDate: new Date(member.joinDate).toISOString().split('T')[0],
      expiryDate: member.expiryDate ? new Date(member.expiryDate).toISOString().split('T')[0] : ''
    });
    this.isPanelOpen.set(true);
  }

  deleteMember(member: Member): void {
    if (confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)) {
      this.allMembers.update(current => current.filter(m => m.id !== member.id));
      console.log('Member deleted successfully');
    }
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.memberForm.reset();
    this.selectedMember.set(null);
  }

  onSubmit(): void {
    if (this.memberForm.invalid) return;

    this.submitting.set(true);
    const formData = this.memberForm.value;

    const memberData: Member = {
      id: this.isEditMode() ? this.selectedMember()!.id : Date.now().toString(),
      ...formData,
      joinDate: new Date(formData.joinDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      lastVisit: this.isEditMode() ? this.selectedMember()?.lastVisit : undefined,
      avatar: this.isEditMode() ? this.selectedMember()?.avatar : ''
    };

    setTimeout(() => {
      if (this.isEditMode()) {
        this.allMembers.update(current => 
          current.map(m => m.id === memberData.id ? memberData : m)
        );
        console.log('Member updated successfully');
      } else {
        this.allMembers.update(current => [memberData, ...current]);
        console.log('Member added successfully');
      }

      this.submitting.set(false);
      this.closePanel();
    }, 1000);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
  }

  onRowSelect(selectedRows: Member[]): void {
    console.log('Selected rows:', selectedRows);
  }
}