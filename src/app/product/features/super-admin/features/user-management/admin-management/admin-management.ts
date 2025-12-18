import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, TableAction, TableColumn, PaginationConfig } from '../../../../../shared/components/data-table/data-table';
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
  avatar?: string;
  assignedGymsCount?: string;
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
  // Signals for reactive state
  admins = signal<Admin[]>([]);
  availableGyms = signal<Gym[]>([]);
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  isEditMode = signal(false);
  selectedAdmin = signal<Admin | null>(null);

  // Filter signals
  searchFilter = signal('');
  statusFilter = signal('');
  roleFilter = signal('');

  // Computed filtered admins
  filteredAdmins = computed(() => {
    let filtered = [...this.admins()];

    // Search filter
    const search = this.searchFilter().toLowerCase();
    if (search) {
      filtered = filtered.filter(admin => 
        admin.name.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search)
      );
    }

    // Status filter
    const status = this.statusFilter();
    if (status) {
      filtered = filtered.filter(admin => admin.status === status);
    }

    // Role filter
    const role = this.roleFilter();
    if (role) {
      filtered = filtered.filter(admin => admin.role === role);
    }

    // Add computed field for table
    return filtered.map(admin => ({
      ...admin,
      assignedGymsCount: admin.role === 'super-admin' ? 'All' : admin.assignedGyms.length.toString()
    }));
  });

  // Table Configuration
  columns: TableColumn[] = [
    { key: 'avatar', label: 'Avatar', type: 'avatar', width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
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

  paginationConfig: PaginationConfig = {
    enabled: true,
    itemsPerPage: 10
  };

  // Available permissions
  availablePermissions: Permission[] = [
    { key: 'manage_members', label: 'Manage Members' },
    { key: 'manage_trainers', label: 'Manage Trainers' },
    { key: 'manage_classes', label: 'Manage Classes' },
    { key: 'manage_billing', label: 'Manage Billing' },
    { key: 'view_reports', label: 'View Reports' },
    { key: 'manage_equipment', label: 'Manage Equipment' },
  ];

  // Form
  adminForm!: FormGroup;
  selectedGyms: Set<string> = new Set();
  selectedPermissions: Set<string> = new Set();

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
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
    this.loading.set(true);
    
    // Mock gyms
    this.availableGyms.set([
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' },
      { id: 'gym-4', name: 'North Peak Fitness' },
      { id: 'gym-5', name: 'South Bay Wellness' }
    ]);

    // Mock admins
    const mockAdmins: Admin[] = [
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
        lastLogin: new Date('2024-12-14'),
        avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=dc2626&color=fff'
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
        lastLogin: new Date('2024-12-14'),
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=dc2626&color=fff'
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
        lastLogin: new Date('2024-11-20'),
        avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=dc2626&color=fff'
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
        lastLogin: new Date('2024-10-15'),
        avatar: 'https://ui-avatars.com/api/?name=David+Martinez&background=dc2626&color=fff'
      },
      {
        id: '6',
        name: 'Lisa Anderson',
        email: 'lisa.a@fitpro.com',
        phone: '+1 (555) 678-9012',
        role: 'gym-admin',
        status: 'active',
        assignedGyms: ['gym-3'],
        permissions: ['manage_members', 'manage_trainers'],
        createdAt: new Date('2024-05-18'),
        lastLogin: new Date('2024-12-12')
      },
      {
        id: '7',
        name: 'Robert Taylor',
        email: 'robert.t@fitpro.com',
        phone: '+1 (555) 789-0123',
        role: 'gym-admin',
        status: 'active',
        assignedGyms: ['gym-4', 'gym-5'],
        permissions: ['manage_members', 'manage_classes', 'view_reports'],
        createdAt: new Date('2024-06-22'),
        lastLogin: new Date('2024-12-13'),
        avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=dc2626&color=fff'
      },
      {
        id: '8',
        name: 'Jennifer Davis',
        email: 'jennifer.d@fitpro.com',
        phone: '+1 (555) 890-1234',
        role: 'gym-admin',
        status: 'inactive',
        assignedGyms: ['gym-1'],
        permissions: ['manage_members'],
        createdAt: new Date('2024-07-30'),
        lastLogin: new Date('2024-11-05')
      }
    ];

    setTimeout(() => {
      this.admins.set(mockAdmins);
      this.loading.set(false);
    }, 500);
  }

  // Filter methods
  onSearchChange(value: string): void {
    this.searchFilter.set(value);
  }

  onStatusChange(value: string): void {
    this.statusFilter.set(value);
  }

  onRoleChange(value: string): void {
    this.roleFilter.set(value);
  }

  resetFilters(): void {
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.roleFilter.set('');
  }

  // Panel methods
  openAddAdminPanel(): void {
    this.isEditMode.set(false);
    this.selectedAdmin.set(null);
    this.adminForm.reset({
      role: 'gym-admin',
      status: 'active'
    });
    this.selectedGyms.clear();
    this.selectedPermissions.clear();
    this.isPanelOpen.set(true);
  }

  editAdmin(admin: Admin): void {
    this.isEditMode.set(true);
    this.selectedAdmin.set(admin);
    this.adminForm.patchValue({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status
    });
    this.selectedGyms = new Set(admin.assignedGyms);
    this.selectedPermissions = new Set(admin.permissions);
    this.isPanelOpen.set(true);
  }

  deleteAdmin(admin: Admin): void {
    if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
      this.admins.update(admins => admins.filter(a => a.id !== admin.id));
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
    this.isPanelOpen.set(false);
    this.adminForm.reset();
    this.selectedGyms.clear();
    this.selectedPermissions.clear();
  }

  onSubmit(): void {
    if (this.adminForm.invalid) return;

    this.submitting.set(true);

    const formData = this.adminForm.value;
    const adminData: Admin = {
      id: this.isEditMode() ? this.selectedAdmin()!.id : Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      assignedGyms: Array.from(this.selectedGyms),
      permissions: Array.from(this.selectedPermissions),
      createdAt: this.isEditMode() ? this.selectedAdmin()!.createdAt : new Date(),
      lastLogin: this.isEditMode() ? this.selectedAdmin()!.lastLogin : undefined,
      avatar: this.isEditMode() ? this.selectedAdmin()!.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=dc2626&color=fff`
    };

    setTimeout(() => {
      if (this.isEditMode()) {
        this.admins.update(admins => {
          const index = admins.findIndex(a => a.id === adminData.id);
          if (index !== -1) {
            const updated = [...admins];
            updated[index] = adminData;
            return updated;
          }
          return admins;
        });
      } else {
        this.admins.update(admins => [adminData, ...admins]);
      }

      this.submitting.set(false);
      this.closePanel();
      console.log('Saved admin:', adminData);
    }, 1000);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
    // Page change is handled by the data-table component
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    const sortedAdmins = [...this.admins()].sort((a, b) => {
      const aValue = a[event.key as keyof Admin];
      const bValue = b[event.key as keyof Admin];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return event.direction === 'asc' ? comparison : -comparison;
    });

    this.admins.set(sortedAdmins);
    console.log('Sorted by:', event);
  }
}