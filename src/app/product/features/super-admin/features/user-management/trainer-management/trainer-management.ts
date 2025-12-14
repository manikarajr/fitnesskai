import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
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

@Component({
  selector: 'app-trainer-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DataTable, OffcanvasPanel],
  templateUrl: './trainer-management.html',
  styleUrl: './trainer-management.scss',
})
export class TrainerManagement implements OnInit {
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

  trainers: Trainer[] = [];
  filteredTrainers: Trainer[] = [];
  availableGyms: Gym[] = [];
  loading = false;
  submitting = false;
  isPanelOpen = false;
  isEditMode = false;
  selectedTrainer: Trainer | null = null;
  trainerForm!: FormGroup;

  filters = { search: '', gym: '', status: '' };

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
    this.loading = true;

    this.availableGyms = [
      { id: 'gym-1', name: 'Downtown Fitness Center' },
      { id: 'gym-2', name: 'Westside Gym' },
      { id: 'gym-3', name: 'East Valley Sports Club' }
    ];

    this.trainers = [
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
      }
    ];

    setTimeout(() => this.loading = false, 500);
  }

  applyFilters(): void {
    let filtered = [...this.trainers];

    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(search) || 
        t.email.toLowerCase().includes(search)
      );
    }

    if (this.filters.gym) {
      filtered = filtered.filter(t => t.gymId === this.filters.gym);
    }

    if (this.filters.status) {
      filtered = filtered.filter(t => t.status === this.filters.status);
    }

    this.filteredTrainers = filtered;
    this.pagination.totalItems = filtered.length;
    this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.itemsPerPage);
  }

  resetFilters(): void {
    this.filters = { search: '', gym: '', status: '' };
    this.applyFilters();
  }

  openAddTrainerPanel(): void {
    this.isEditMode = false;
    this.selectedTrainer = null;
    this.trainerForm.reset({ status: 'active' });
    this.isPanelOpen = true;
  }

  editTrainer(trainer: Trainer): void {
    this.isEditMode = true;
    this.selectedTrainer = trainer;
    this.trainerForm.patchValue(trainer);
    this.isPanelOpen = true;
  }

  deleteTrainer(trainer: Trainer): void {
    if (confirm(`Delete ${trainer.name}?`)) {
      this.trainers = this.trainers.filter(t => t.id !== trainer.id);
      this.applyFilters();
    }
  }

  closePanel(): void {
    this.isPanelOpen = false;
    this.trainerForm.reset();
  }

  onSubmit(): void {
    if (this.trainerForm.invalid) return;

    this.submitting = true;
    const formData = this.trainerForm.value;
    const gym = this.availableGyms.find(g => g.id === formData.gymId);

    const trainerData: Trainer = {
      id: this.isEditMode ? this.selectedTrainer!.id : Date.now().toString(),
      ...formData,
      gymName: gym?.name || '',
      totalClients: this.isEditMode ? this.selectedTrainer!.totalClients : 0,
      createdAt: this.isEditMode ? this.selectedTrainer!.createdAt : new Date()
    };

    setTimeout(() => {
      if (this.isEditMode) {
        const index = this.trainers.findIndex(t => t.id === trainerData.id);
        if (index !== -1) this.trainers[index] = trainerData;
      } else {
        this.trainers.unshift(trainerData);
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