import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gymId: string;
  gymName: string;
  specialization: string;
  certifications: string;
  status: 'active' | 'inactive';
  totalClients: number;
  createdAt: Date;
}

interface Gym {
  id: string;
  name: string;
}

interface TrainerFilters {
  search: string;
  gym: string;
  status: string;
}

@Component({
  selector: 'app-trainer-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './trainer-management.html',
  styleUrl: './trainer-management.scss',
})
export class TrainerManagement implements OnInit {
  // Signals for reactive state
  trainers = signal<Trainer[]>([]);
  availableGyms = signal<Gym[]>([]);
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  isEditMode = signal(false);
  selectedTrainer = signal<Trainer | null>(null);
  
  // Filter signals
  searchFilter = signal('');
  gymFilter = signal('');
  statusFilter = signal('');
  
  // Sort signals
  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed filtered and sorted trainers
  filteredTrainers = computed(() => {
    let filtered = [...this.trainers()];

    // Apply search filter
    const search = this.searchFilter().toLowerCase();
    if (search) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(search) || 
        t.email.toLowerCase().includes(search)
      );
    }

    // Apply gym filter
    const gym = this.gymFilter();
    if (gym) {
      filtered = filtered.filter(t => t.gymId === gym);
    }

    // Apply status filter
    const status = this.statusFilter();
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }

    // Apply sorting
    const key = this.sortKey();
    if (key) {
      filtered.sort((a, b) => {
        const aVal = a[key as keyof Trainer];
        const bVal = b[key as keyof Trainer];
        
        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;
        
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  });

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, type: 'avatar' },
    { key: 'gymName', label: 'Gym', sortable: true },
    { key: 'specialization', label: 'Specialization', sortable: true },
    { key: 'totalClients', label: 'Clients', sortable: true },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  ];

  tableActions: TableAction[] = [
    { label: 'Edit', icon: 'edit', color: 'primary', action: (row) => this.editTrainer(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deleteTrainer(row) }
  ];

  paginationConfig = { enabled: true, itemsPerPage: 10 };

  // Form
  trainerForm!: FormGroup;

  // Non-reactive properties for form binding
  filters: TrainerFilters = { search: '', gym: '', status: '' };

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  initForm(): void {
    this.trainerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      gymId: ['', Validators.required],
      specialization: [''],
      certifications: [''],
      status: ['active', Validators.required]
    });
  }

  loadMockData(): void {
    this.loading.set(true);

    const gyms: Gym[] = [
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' }
    ];

    const trainerData: Trainer[] = [
      {
        id: '1',
        name: 'Alex Rodriguez',
        email: 'alex.r@fitpro.com',
        phone: '+1 (555) 111-2222',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        specialization: 'CrossFit, HIIT',
        certifications: 'ACE, NASM-CPT',
        status: 'active',
        totalClients: 24,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '2',
        name: 'Jessica Lee',
        email: 'jessica.l@fitpro.com',
        phone: '+1 (555) 222-3333',
        gymId: 'gym-1',
        gymName: 'Downtown Fitness Center',
        specialization: 'Yoga, Pilates',
        certifications: 'RYT-200, PMA-CPT',
        status: 'active',
        totalClients: 31,
        createdAt: new Date('2024-02-15')
      },
      {
        id: '3',
        name: 'Marcus Thompson',
        email: 'marcus.t@fitpro.com',
        phone: '+1 (555) 333-4444',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        specialization: 'Strength Training',
        certifications: 'CSCS, NSCA-CPT',
        status: 'active',
        totalClients: 19,
        createdAt: new Date('2024-03-01')
      },
      {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah.w@fitpro.com',
        phone: '+1 (555) 444-5555',
        gymId: 'gym-2',
        gymName: 'Westside Gym',
        specialization: 'Cardio, Spinning',
        certifications: 'ACE, Spinning Cert',
        status: 'inactive',
        totalClients: 12,
        createdAt: new Date('2024-03-15')
      },
      {
        id: '5',
        name: 'David Chen',
        email: 'david.c@fitpro.com',
        phone: '+1 (555) 555-6666',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        specialization: 'Boxing, MMA',
        certifications: 'USA Boxing Coach',
        status: 'active',
        totalClients: 28,
        createdAt: new Date('2024-04-01')
      },
      {
        id: '6',
        name: 'Emily Martinez',
        email: 'emily.m@fitpro.com',
        phone: '+1 (555) 666-7777',
        gymId: 'gym-3',
        gymName: 'East Valley Sports Club',
        specialization: 'Nutrition, Weight Loss',
        certifications: 'RD, CSSD',
        status: 'active',
        totalClients: 35,
        createdAt: new Date('2024-04-10')
      }
    ];

    setTimeout(() => {
      this.availableGyms.set(gyms);
      this.trainers.set(trainerData);
      this.loading.set(false);
    }, 500);
  }

  applyFilters(): void {
    this.searchFilter.set(this.filters.search);
    this.gymFilter.set(this.filters.gym);
    this.statusFilter.set(this.filters.status);
  }

  resetFilters(): void {
    this.filters = { search: '', gym: '', status: '' };
    this.searchFilter.set('');
    this.gymFilter.set('');
    this.statusFilter.set('');
  }

  openAddTrainerPanel(): void {
    this.isEditMode.set(false);
    this.selectedTrainer.set(null);
    this.trainerForm.reset({ status: 'active' });
    this.isPanelOpen.set(true);
  }

  editTrainer(trainer: Trainer): void {
    this.isEditMode.set(true);
    this.selectedTrainer.set(trainer);
    this.trainerForm.patchValue(trainer);
    this.isPanelOpen.set(true);
  }

  deleteTrainer(trainer: Trainer): void {
    if (confirm(`Are you sure you want to delete ${trainer.name}?`)) {
      const updatedTrainers = this.trainers().filter(t => t.id !== trainer.id);
      this.trainers.set(updatedTrainers);
    }
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.trainerForm.reset();
    this.selectedTrainer.set(null);
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) return;

    this.submitting.set(true);
    const formData = this.trainerForm.value;
    const gym = this.availableGyms().find(g => g.id === formData.gymId);

    const trainerData: Trainer = {
      id: this.isEditMode() ? this.selectedTrainer()!.id : Date.now().toString(),
      ...formData,
      gymName: gym?.name || '',
      totalClients: this.isEditMode() ? this.selectedTrainer()!.totalClients : 0,
      createdAt: this.isEditMode() ? this.selectedTrainer()!.createdAt : new Date()
    };

    setTimeout(() => {
      if (this.isEditMode()) {
        const updatedTrainers = this.trainers().map(t => 
          t.id === trainerData.id ? trainerData : t
        );
        this.trainers.set(updatedTrainers);
      } else {
        this.trainers.set([trainerData, ...this.trainers()]);
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

  onRowSelect(selectedRows: Trainer[]): void {
    console.log('Selected rows:', selectedRows);
  }
}