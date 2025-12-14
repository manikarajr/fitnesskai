import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'gym-admin';
  status: 'active' | 'inactive' | 'suspended';
  assignedGyms: string[];
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

interface Gym {
  id: string;
  name: string;
}

interface Permission {
  key: string;
  label: string;
}

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './admin-management.html',
  styleUrl: './admin-management.scss',
})
export class AdminManagement implements OnInit {
  // Table Configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, type: 'badge' },
    { key: 'assignedGymsCount', label: 'Gyms', sortable: true },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
    { key: 'lastLogin', label: 'Last Login', sortable: true, type: 'date' },
  ];

  tableActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      color: 'primary',
      action: (row: Admin) => this.editAdmin(row)
    },
    {
      label: 'Delete',
      icon: 'delete',
      color: 'danger',
      action: (row: Admin) => this.deleteAdmin(row)
    }
  ];

  // Data
  admins: Admin[] = [];
  filteredAdmins: Admin[] = [];
  availableGyms: Gym[] = [];
  availablePermissions: Permission[] = [
    { key: 'manage_members', label: 'Manage Members' },
    { key: 'manage_trainers', label: 'Manage Trainers' },
    { key: 'manage_classes', label: 'Manage Classes' },
    { key: 'manage_billing', label: 'Manage Billing' },
    { key: 'view_reports', label: 'View Reports' },
    { key: 'manage_equipment', label: 'Manage Equipment' },
  ];

  // State
  loading = false;
  submitting = false;
  isPanelOpen = false;
  isEditMode = false;
  selectedAdmin: Admin | null = null;

  // Form
  adminForm!: FormGroup;
  selectedGyms: Set<string> = new Set();
  selectedPermissions: Set<string> = new Set();

  // Filters
  filters = {
    search: '',
    status: '',
    role: ''
  };

  // Pagination
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
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['gym-admin', Validators.required],
      status: ['active', Validators.required]
    });
  }

  loadMockData(): void {
    this.loading = true;
    
    // Mock gyms
    this.availableGyms = [
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' },
      { id: 'gym-4', name: 'North Peak Fitness' },
      { id: 'gym-5', name: 'South Bay Wellness' }
    ];

    // Mock admins
    this.admins = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@fitpro.com',
        phone: '+1 (555) 123-4567',
        role: 'gym-admin',
        status: 'active',
        assignedGyms: ['gym-1', 'gym-2'],
        permissions: ['manage_members', 'manage_trainers', 'view_reports'],
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-12-14')
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@fitpro.com',
        phone: '+1 (555) 234-5678',
        role: 'super-admin',
        status: 'active',
        assignedGyms: [],
        permissions: ['manage_members', 'manage_trainers', 'manage_classes', 'manage_billing', 'view_reports', 'manage_equipment'],
        createdAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-12-14')
      },
      {
        id: '3',
        name: 'Mike Williams',
        email: 'mike.w@fitpro.com',
        phone: '+1 (555) 345-6789',
        role: 'gym-admin',
        status: 'active',
        assignedGyms: ['gym-3', 'gym-4', 'gym-5'],
        permissions: ['manage_members', 'manage_classes', 'view_reports'],
        createdAt: new Date('2024-02-20'),
        lastLogin: new Date('2024-12-13')
      },
      {
        id: '4',
        name: 'Emily Brown',
        email: 'emily.b@fitpro.com',
        phone: '+1 (555) 456-7890',
        role: 'gym-admin',
        status: 'inactive',
        assignedGyms: ['gym-1'],
        permissions: ['manage_members', 'view_reports'],
        createdAt: new Date('2024-03-05'),
        lastLogin: new Date('2024-11-20')
      },
      {
        id: '5',
        name: 'David Martinez',
        email: 'david.m@fitpro.com',
        phone: '+1 (555) 567-8901',
        role: 'gym-admin',
        status: 'suspended',
        assignedGyms: ['gym-2'],
        permissions: ['manage_members'],
        createdAt: new Date('2024-04-12'),
        lastLogin: new Date('2024-10-15')
      }
    ];

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    let filtered = [...this.admins];

    // Search filter
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(admin => 
        admin.name.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (this.filters.status) {
      filtered = filtered.filter(admin => admin.status === this.filters.status);
    }

    // Role filter
    if (this.filters.role) {
      filtered = filtered.filter(admin => admin.role === this.filters.role);
    }

    // Add computed field for table
    this.filteredAdmins = filtered.map(admin => ({
      ...admin,
      assignedGymsCount: admin.role === 'super-admin' ? 'All' : admin.assignedGyms.length.toString()
    }));

    // Update pagination
    this.pagination.totalItems = this.filteredAdmins.length;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      status: '',
      role: ''
    };
    this.applyFilters();
  }

  openAddAdminPanel(): void {
    this.isEditMode = false;
    this.selectedAdmin = null;
    this.adminForm.reset({
      role: 'gym-admin',
      status: 'active'
    });
    this.selectedGyms.clear();
    this.selectedPermissions.clear();
    this.isPanelOpen = true;
  }

  editAdmin(admin: Admin): void {
    this.isEditMode = true;
    this.selectedAdmin = admin;
    this.adminForm.patchValue({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status
    });
    this.selectedGyms = new Set(admin.assignedGyms);
    this.selectedPermissions = new Set(admin.permissions);
    this.isPanelOpen = true;
  }

  deleteAdmin(admin: Admin): void {
    if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
      this.admins = this.admins.filter(a => a.id !== admin.id);
      this.applyFilters();
      console.log('Deleted admin:', admin);
    }
  }

  toggleGym(gymId: string): void {
    if (this.selectedGyms.has(gymId)) {
      this.selectedGyms.delete(gymId);
    } else {
      this.selectedGyms.add(gymId);
    }
  }

  isGymSelected(gymId: string): boolean {
    return this.selectedGyms.has(gymId);
  }

  togglePermission(permissionKey: string): void {
    if (this.selectedPermissions.has(permissionKey)) {
      this.selectedPermissions.delete(permissionKey);
    } else {
      this.selectedPermissions.add(permissionKey);
    }
  }

  isPermissionSelected(permissionKey: string): boolean {
    return this.selectedPermissions.has(permissionKey);
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.adminForm.reset();
    this.selectedGyms.clear();
    this.selectedPermissions.clear();
  }

  onSubmit(): void {
    if (this.adminForm.invalid) return;

    this.submitting = true;

    const formData = this.adminForm.value;
    const adminData: Admin = {
      id: this.isEditMode ? this.selectedAdmin!.id : Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      assignedGyms: Array.from(this.selectedGyms),
      permissions: Array.from(this.selectedPermissions),
      createdAt: this.isEditMode ? this.selectedAdmin!.createdAt : new Date(),
      lastLogin: this.isEditMode ? this.selectedAdmin!.lastLogin : undefined
    };

    setTimeout(() => {
      if (this.isEditMode) {
        const index = this.admins.findIndex(a => a.id === adminData.id);
        if (index !== -1) {
          this.admins[index] = adminData;
        }
      } else {
        this.admins.unshift(adminData);
      }

      this.applyFilters();
      this.submitting = false;
      this.closePanel();
      console.log('Saved admin:', adminData);
    }, 1000);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    // Implement actual pagination logic here
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    // Implement sorting logic here
    console.log('Sort:', event);
  }
}