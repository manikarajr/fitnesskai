import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable, TableAction, TableColumn } from '../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface Gym {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  members: number;
  trainers: number;
  status: string;
  joinedDate: Date;
  revenue: number;
}

@Component({
  selector: 'app-gym-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTable, OffcanvasPanel],
  templateUrl: './gym-management.html',
  styleUrl: './gym-management.scss'
})
export class GymManagement implements OnInit {

  // Convert all state to signals
  gyms = signal<Gym[]>([]);
  loading = signal(false);
  
  isFormOpen = signal(false);
  isEditMode = signal(false);
  selectedGym: Gym | null = null;
  gymForm: FormGroup;
  
  // Filter signals
  searchTerm = signal('');
  filterStatus = signal('all');
  filterPlan = signal('all');
  
  // Pagination configuration - set items per page here
  paginationConfig = {
    enabled: true,
    itemsPerPage: 6  // Show 6 items per page
  };
  
  // Computed signal for filtered gyms - automatically updates when dependencies change
  filteredGyms = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.filterStatus();
    const plan = this.filterPlan();
    
    return this.gyms().filter(gym => {
      const matchesSearch = !search || 
        gym.name.toLowerCase().includes(search) ||
        gym.owner.toLowerCase().includes(search) ||
        gym.email.toLowerCase().includes(search);
      
      const matchesStatus = status === 'all' || 
        gym.status.toLowerCase() === status.toLowerCase();
      
      const matchesPlan = plan === 'all' || 
        gym.plan.toLowerCase() === plan.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  });

  columns: TableColumn[] = [
    { key: 'name', label: 'Gym Name', sortable: true, type: 'avatar' },
    { key: 'plan', label: 'Plan', type: 'badge', sortable: true },
    { key: 'members', label: 'Members', sortable: true },
    { key: 'trainers', label: 'Trainers', sortable: true },
    { key: 'revenue', label: 'Revenue', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge', sortable: true },
    { key: 'joinedDate', label: 'Joined', type: 'date', sortable: true }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      color: 'primary',
      action: (gym) => this.editGym(gym)
    },
    {
      label: 'Suspend',
      icon: 'block',
      color: 'danger',
      action: (gym) => this.suspendGym(gym)
    }
  ];

  constructor(private fb: FormBuilder) {
    this.gymForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      owner: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      plan: ['starter', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.loading.set(true);
    
    // Simulate API call - replace with actual HTTP call later
    setTimeout(() => {
      const gymsData: Gym[] = [
        {
          id: 1,
          name: 'PowerHouse Gym',
          owner: 'John Smith',
          email: 'john@powerhouse.com',
          phone: '+1 234 567 8900',
          address: '123 Main St, New York, NY',
          plan: 'Professional',
          members: 842,
          trainers: 12,
          status: 'Active',
          joinedDate: new Date('2024-01-15'),
          revenue: 6890
        },
        {
          id: 2,
          name: 'FitZone Central',
          owner: 'Sarah Johnson',
          email: 'sarah@fitzone.com',
          phone: '+1 234 567 8901',
          address: '456 Oak Ave, Los Angeles, CA',
          plan: 'Enterprise',
          members: 756,
          trainers: 15,
          status: 'Active',
          joinedDate: new Date('2024-02-20'),
          revenue: 5240
        },
        {
          id: 3,
          name: 'Elite Fitness',
          owner: 'Michael Brown',
          email: 'mike@elitefitness.com',
          phone: '+1 234 567 8902',
          address: '789 Pine Rd, Chicago, IL',
          plan: 'Professional',
          members: 623,
          trainers: 10,
          status: 'Active',
          joinedDate: new Date('2023-11-10'),
          revenue: 4950
        },
        {
          id: 4,
          name: 'Metro Gym',
          owner: 'Emily Davis',
          email: 'emily@metrogym.com',
          phone: '+1 234 567 8903',
          address: '321 Elm St, Houston, TX',
          plan: 'Professional',
          members: 512,
          trainers: 8,
          status: 'Active',
          joinedDate: new Date('2024-03-05'),
          revenue: 3890
        },
        {
          id: 5,
          name: 'Iron Paradise',
          owner: 'David Wilson',
          email: 'david@ironparadise.com',
          phone: '+1 234 567 8904',
          address: '654 Maple Dr, Phoenix, AZ',
          plan: 'Starter',
          members: 489,
          trainers: 5,
          status: 'Active',
          joinedDate: new Date('2024-04-12'),
          revenue: 3120
        },
        {
          id: 6,
          name: 'FitZone Downtown',
          owner: 'Lisa Anderson',
          email: 'lisa@fitzone-dt.com',
          phone: '+1 234 567 8905',
          address: '987 Cedar Ln, Philadelphia, PA',
          plan: 'Starter',
          members: 234,
          trainers: 4,
          status: 'Pending',
          joinedDate: new Date('2024-11-28'),
          revenue: 1560
        },
        {
          id: 7,
          name: 'CrossFit Arena',
          owner: 'Robert Taylor',
          email: 'robert@crossfitarena.com',
          phone: '+1 234 567 8906',
          address: '147 Birch St, San Antonio, TX',
          plan: 'Professional',
          members: 398,
          trainers: 7,
          status: 'Suspended',
          joinedDate: new Date('2023-09-22'),
          revenue: 2980
        },
        {
          id: 8,
          name: 'Wellness Hub',
          owner: 'Jennifer Martinez',
          email: 'jen@wellnesshub.com',
          phone: '+1 234 567 8907',
          address: '258 Spruce Ave, San Diego, CA',
          plan: 'Starter',
          members: 178,
          trainers: 3,
          status: 'Active',
          joinedDate: new Date('2024-05-18'),
          revenue: 1190
        },
        {
          id: 9,
          name: 'Titan Strength',
          owner: 'Chris Evans',
          email: 'chris@titanstrength.com',
          phone: '+1 234 567 8908',
          address: '369 Oak Dr, Dallas, TX',
          plan: 'Enterprise',
          members: 921,
          trainers: 18,
          status: 'Active',
          joinedDate: new Date('2023-08-14'),
          revenue: 7230
        },
        {
          id: 10,
          name: 'Apex Performance',
          owner: 'Maria Garcia',
          email: 'maria@apexperf.com',
          phone: '+1 234 567 8909',
          address: '741 Main Ave, Austin, TX',
          plan: 'Professional',
          members: 689,
          trainers: 11,
          status: 'Active',
          joinedDate: new Date('2024-01-22'),
          revenue: 5680
        }
      ];
      
      // Update signal with data
      this.gyms.set(gymsData);
      this.loading.set(false);
    }, 500);
  }

  openForm(): void {
    this.isEditMode.set(false);
    this.selectedGym = null;
    this.gymForm.reset({
      plan: 'starter',
      status: 'active'
    });
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.gymForm.reset();
  }

  editGym(gym: Gym): void {
    this.isEditMode.set(true);
    this.selectedGym = gym;
    this.gymForm.patchValue({
      name: gym.name,
      owner: gym.owner,
      email: gym.email,
      phone: gym.phone,
      address: gym.address,
      plan: gym.plan.toLowerCase(),
      status: gym.status.toLowerCase()
    });
    this.isFormOpen.set(true);
  }

  suspendGym(gym: Gym): void {
    if (confirm(`Are you sure you want to suspend ${gym.name}?`)) {
      // Create updated array with modified gym
      const updatedGyms = this.gyms().map(g => 
        g.id === gym.id ? { ...g, status: 'Suspended' } : g
      );
      this.gyms.set(updatedGyms);
    }
  }

  saveGym(): void {
    if (this.gymForm.valid) {
      const formValue = this.gymForm.value;
      
      if (this.isEditMode() && this.selectedGym) {
        // Update existing gym
        const updatedGyms = this.gyms().map(gym => 
          gym.id === this.selectedGym!.id 
            ? { 
                ...gym, 
                ...formValue,
                plan: this.capitalizeFirst(formValue.plan),
                status: this.capitalizeFirst(formValue.status)
              }
            : gym
        );
        this.gyms.set(updatedGyms);
      } else {
        // Add new gym
        const newGym: Gym = {
          id: this.gyms().length + 1,
          ...formValue,
          plan: this.capitalizeFirst(formValue.plan),
          status: this.capitalizeFirst(formValue.status),
          members: 0,
          trainers: 0,
          revenue: 0,
          joinedDate: new Date()
        };
        this.gyms.set([newGym, ...this.gyms()]);
      }
      
      this.closeForm();
    }
  }

  onPageChange(page: number): void {
    // Handle page change if needed
    console.log('Page changed to:', page);
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    const sortedGyms = [...this.gyms()].sort((a, b) => {
      const aValue = a[event.key as keyof Gym];
      const bValue = b[event.key as keyof Gym];
      
      if (aValue < bValue) return event.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return event.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.gyms.set(sortedGyms);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}