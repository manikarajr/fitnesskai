import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, TableAction, TableColumn, PaginationConfig } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  gymId: string;
  gymName: string;
  membershipType: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive';
  joinDate: Date;
  expiryDate?: Date;
  avatar?: string;
}

interface Gym {
  id: string;
  name: string;
}

interface Filters {
  search: string;
  gym: string;
  membership: string;
  status: string;
}

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './member-management.html',
  styleUrl: './member-management.scss',
})
export class MemberManagement implements OnInit {
  // Signals for reactive state
  private allMembers = signal<Member[]>([]);
  availableGyms = signal<Gym[]>([]);
  filters = signal<Filters>({ search: '', gym: '', membership: '', status: '' });
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  isEditMode = signal(false);
  selectedMember = signal<Member | null>(null);
  
  // Pagination and sorting signals
  currentPage = signal(1);
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Pagination configuration signal
  paginationConfig = signal<PaginationConfig>({
    enabled: true,
    itemsPerPage: 6
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

    // Apply gym filter
    if (currentFilters.gym) {
      filtered = filtered.filter(m => m.gymId === currentFilters.gym);
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
    { key: 'gymName', label: 'Gym', sortable: true, type: 'text' },
    { key: 'membershipType', label: 'Plan', sortable: true, type: 'badge' },
    { key: 'joinDate', label: 'Join Date', sortable: true, type: 'date' },
    { key: 'expiryDate', label: 'Expiry', sortable: true, type: 'date' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  ];

  tableActions: TableAction[] = [
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
      phone: [''],
      gymId: ['', Validators.required],
      membershipType: ['basic', Validators.required],
      status: ['active', Validators.required],
      joinDate: [new Date().toISOString().split('T')[0], Validators.required],
      expiryDate: ['']
    });
  }

  loadMockData(): void {
    this.loading.set(true);

    const gyms: Gym[] = [
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' }
    ];

    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Robert Chen',
        email: 'robert.c@email.com',
        phone: '+1 (555) 777-8888',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-15'),
        avatar: ''
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.g@email.com',
        phone: '+1 (555) 888-9999',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-02-01'),
        avatar: ''
      },
      {
        id: '3',
        name: 'James Wilson',
        email: 'james.w@email.com',
        phone: '+1 (555) 999-0000',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-03-10'),
        expiryDate: new Date('2024-12-10'),
        avatar: ''
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 111-2222',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-04-20'),
        expiryDate: new Date('2025-04-20'),
        avatar: ''
      },
      {
        id: '5',
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        phone: '+1 (555) 333-4444',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        membershipType: 'vip',
        status: 'inactive',
        joinDate: new Date('2023-12-01'),
        expiryDate: new Date('2024-12-01'),
        avatar: ''
      },
      {
        id: '6',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1 (555) 555-6666',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-05-15'),
        expiryDate: new Date('2025-05-15'),
        avatar: ''
      },
      {
        id: '7',
        name: 'David Martinez',
        email: 'david.m@email.com',
        phone: '+1 (555) 777-8889',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-06-01'),
        expiryDate: new Date('2025-06-01'),
        avatar: ''
      },
      {
        id: '8',
        name: 'Jennifer Taylor',
        email: 'jennifer.t@email.com',
        phone: '+1 (555) 888-9990',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-07-10'),
        expiryDate: new Date('2025-07-10'),
        avatar: ''
      },
      {
        id: '9',
        name: 'Christopher Lee',
        email: 'chris.l@email.com',
        phone: '+1 (555) 222-3333',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-08-01'),
        expiryDate: new Date('2025-08-01'),
        avatar: ''
      },
      {
        id: '10',
        name: 'Amanda White',
        email: 'amanda.w@email.com',
        phone: '+1 (555) 444-5555',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-09-15'),
        expiryDate: new Date('2025-09-15'),
        avatar: ''
      },
      {
        id: '11',
        name: 'Daniel Anderson',
        email: 'daniel.a@email.com',
        phone: '+1 (555) 666-7777',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-10-01'),
        expiryDate: new Date('2025-10-01'),
        avatar: ''
      },
      {
        id: '12',
        name: 'Lisa Thompson',
        email: 'lisa.t@email.com',
        phone: '+1 (555) 888-9991',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'basic',
        status: 'inactive',
        joinDate: new Date('2023-11-01'),
        expiryDate: new Date('2024-11-01'),
        avatar: ''
      },
      {
        id: '13',
        name: 'Kevin Rodriguez',
        email: 'kevin.r@email.com',
        phone: '+1 (555) 111-2223',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        membershipType: 'premium',
        status: 'active',
        joinDate: new Date('2024-11-01'),
        expiryDate: new Date('2025-11-01'),
        avatar: ''
      },
      {
        id: '14',
        name: 'Rachel Green',
        email: 'rachel.g@email.com',
        phone: '+1 (555) 333-4445',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        membershipType: 'vip',
        status: 'active',
        joinDate: new Date('2024-11-15'),
        expiryDate: new Date('2025-11-15'),
        avatar: ''
      },
      {
        id: '15',
        name: 'Thomas Baker',
        email: 'thomas.b@email.com',
        phone: '+1 (555) 555-6667',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        membershipType: 'basic',
        status: 'active',
        joinDate: new Date('2024-12-01'),
        expiryDate: new Date('2025-12-01'),
        avatar: ''
      }
    ];

    setTimeout(() => {
      this.availableGyms.set(gyms);
      this.allMembers.set(mockMembers);
      this.loading.set(false);
    }, 500);
  }

  updateFilter(key: keyof Filters, value: string): void {
    this.filters.update(current => ({ ...current, [key]: value }));
    this.currentPage.set(1); // Reset to first page when filters change
  }

  resetFilters(): void {
    this.filters.set({ search: '', gym: '', membership: '', status: '' });
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
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
      this.allMembers.update(current => current.filter(m => m.id !== member.id));
      
      // Show success notification (you can replace with your notification service)
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
    const gym = this.availableGyms().find(g => g.id === formData.gymId);

    const memberData: Member = {
      id: this.isEditMode() ? this.selectedMember()!.id : Date.now().toString(),
      ...formData,
      gymName: gym?.name || '',
      joinDate: new Date(formData.joinDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      avatar: this.isEditMode() ? this.selectedMember()?.avatar : ''
    };

    // Simulate API call
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
    // Scroll to top on page change (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
  }

  onRowSelect(selectedRows: Member[]): void {
    console.log('Selected rows:', selectedRows);
    // You can handle bulk actions here
  }

  // Method to update items per page
  updateItemsPerPage(itemsPerPage: number): void {
    this.paginationConfig.update(config => ({
      ...config,
      itemsPerPage
    }));
    this.currentPage.set(1); // Reset to first page
  }

  // Method to toggle pagination
  togglePagination(): void {
    this.paginationConfig.update(config => ({
      ...config,
      enabled: !config.enabled
    }));
  }
}