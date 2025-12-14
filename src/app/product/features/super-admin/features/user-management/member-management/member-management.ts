import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
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
}

interface Gym {
  id: string;
  name: string;
}

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './member-management.html',
  styleUrl: './member-management.scss',
})
export class MemberManagement implements OnInit {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'gymName', label: 'Gym', sortable: true },
    { key: 'membershipType', label: 'Plan', sortable: true, type: 'badge' },
    { key: 'joinDate', label: 'Join Date', sortable: true, type: 'date' },
    { key: 'expiryDate', label: 'Expiry', sortable: true, type: 'date' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  ];

  tableActions: TableAction[] = [
    { label: 'Edit', icon: 'edit', color: 'primary', action: (row) => this.editMember(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deleteMember(row) }
  ];

  members: Member[] = [];
  filteredMembers: Member[] = [];
  availableGyms: Gym[] = [];
  loading = false;
  submitting = false;
  isPanelOpen = false;
  isEditMode = false;
  selectedMember: Member | null = null;
  memberForm!: FormGroup;

  filters = { search: '', gym: '', membership: '', status: '' };

  pagination: PaginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
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
    this.loading = true;

    this.availableGyms = [
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' }
    ];

    this.members = [
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
        expiryDate: new Date('2025-01-15')
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
        expiryDate: new Date('2025-02-01')
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
        expiryDate: new Date('2024-12-10')
      }
    ];

    setTimeout(() => this.loading = false, 500);
  }

  applyFilters(): void {
    let filtered = [...this.members];

    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(search) || 
        m.email.toLowerCase().includes(search)
      );
    }

    if (this.filters.gym) {
      filtered = filtered.filter(m => m.gymId === this.filters.gym);
    }

    if (this.filters.membership) {
      filtered = filtered.filter(m => m.membershipType === this.filters.membership);
    }

    if (this.filters.status) {
      filtered = filtered.filter(m => m.status === this.filters.status);
    }

    this.filteredMembers = filtered;
    this.pagination.totalItems = filtered.length;
    this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.itemsPerPage);
  }

  resetFilters(): void {
    this.filters = { search: '', gym: '', membership: '', status: '' };
    this.applyFilters();
  }

  openAddMemberPanel(): void {
    this.isEditMode = false;
    this.selectedMember = null;
    this.memberForm.reset({
      membershipType: 'basic',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
    this.isPanelOpen = true;
  }

  editMember(member: Member): void {
    this.isEditMode = true;
    this.selectedMember = member;
    this.memberForm.patchValue({
      ...member,
      joinDate: new Date(member.joinDate).toISOString().split('T')[0],
      expiryDate: member.expiryDate ? new Date(member.expiryDate).toISOString().split('T')[0] : ''
    });
    this.isPanelOpen = true;
  }

  deleteMember(member: Member): void {
    if (confirm(`Delete ${member.name}?`)) {
      this.members = this.members.filter(m => m.id !== member.id);
      this.applyFilters();
    }
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.memberForm.reset();
  }

  onSubmit(): void {
    if (this.memberForm.invalid) return;

    this.submitting = true;
    const formData = this.memberForm.value;
    const gym = this.availableGyms.find(g => g.id === formData.gymId);

    const memberData: Member = {
      id: this.isEditMode ? this.selectedMember!.id : Date.now().toString(),
      ...formData,
      gymName: gym?.name || '',
      joinDate: new Date(formData.joinDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    };

    setTimeout(() => {
      if (this.isEditMode) {
        const index = this.members.findIndex(m => m.id === memberData.id);
        if (index !== -1) this.members[index] = memberData;
      } else {
        this.members.unshift(memberData);
      }

      this.applyFilters();
      this.submitting = false;
      this.closePanel();
    }, 1000);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort:', event);
  }
}