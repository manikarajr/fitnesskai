import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DataTable, TableAction, TableColumn } from '../../../../shared/components/data-table/data-table';
import { RouterModule } from '@angular/router';

interface DashboardStats {
  totalGyms: number;
  totalMembers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  gymsChange: number;
  membersChange: number;
  revenueChange: number;
  subscriptionsChange: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: Date;
  status: string;
}

interface TopGym {
  id: number;
  name: string;
  members: number;
  revenue: number;
  plan: string;
  status: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCard, DataTable,RouterModule],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.scss'
})
export class SuperAdminDashboard implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  paginationConfig = {
    enabled: true,
    itemsPerPage: 5  // Show 5 items per page for both tables
  };

  stats: DashboardStats = {
    totalGyms: 156,
    totalMembers: 12847,
    totalRevenue: 45690,
    activeSubscriptions: 142,
    gymsChange: 12.5,
    membersChange: 8.3,
    revenueChange: 15.7,
    subscriptionsChange: 5.2
  };

  recentActivities: RecentActivity[] = [];
  topGyms: TopGym[] = [];
  
  activityColumns: TableColumn[] = [
    { key: 'type', label: 'Type', type: 'badge', sortable: true },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'timestamp', label: 'Time', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' }
  ];

  gymColumns: TableColumn[] = [
    { key: 'name', label: 'Gym Name', sortable: true },
    { key: 'members', label: 'Members', sortable: true },
    { key: 'revenue', label: 'Revenue', type: 'currency', sortable: true },
    { key: 'plan', label: 'Plan', type: 'badge', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' }
  ];

  gymActions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'view',
      color: 'primary',
      action: (gym) => this.viewGym(gym)
    }
  ];

  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      this.recentActivities = [
        {
          id: 1,
          type: 'New Gym',
          description: 'FitZone Downtown registered',
          timestamp: new Date('2024-12-18T10:30:00'),
          status: 'Pending'
        },
        {
          id: 2,
          type: 'Payment',
          description: 'PowerHouse Gym renewed subscription',
          timestamp: new Date('2024-12-18T09:15:00'),
          status: 'Success'
        },
        {
          id: 3,
          type: 'Support',
          description: 'Elite Fitness raised a support ticket',
          timestamp: new Date('2024-12-18T08:45:00'),
          status: 'Active'
        },
        {
          id: 4,
          type: 'Upgrade',
          description: 'Metro Gym upgraded to Professional',
          timestamp: new Date('2024-12-17T16:20:00'),
          status: 'Success'
        },
        {
          id: 5,
          type: 'New Gym',
          description: 'CrossFit Arena submitted application',
          timestamp: new Date('2024-12-17T14:10:00'),
          status: 'Approved'
        },
        {
          id: 6,
          type: 'Payment',
          description: 'FitLife Center monthly payment received',
          timestamp: new Date('2024-12-17T11:30:00'),
          status: 'Success'
        },
        {
          id: 7,
          type: 'Support',
          description: 'Iron Paradise requested feature',
          timestamp: new Date('2024-12-16T15:45:00'),
          status: 'Active'
        },
        {
          id: 8,
          type: 'New Gym',
          description: 'Muscle Factory applied for membership',
          timestamp: new Date('2024-12-16T13:20:00'),
          status: 'Pending'
        }
      ];

      this.topGyms = [
        {
          id: 1,
          name: 'PowerHouse Gym',
          members: 842,
          revenue: 6890,
          plan: 'Professional',
          status: 'Active'
        },
        {
          id: 2,
          name: 'FitZone Central',
          members: 756,
          revenue: 5240,
          plan: 'Enterprise',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Elite Fitness',
          members: 623,
          revenue: 4950,
          plan: 'Professional',
          status: 'Active'
        },
        {
          id: 4,
          name: 'Metro Gym',
          members: 512,
          revenue: 3890,
          plan: 'Professional',
          status: 'Active'
        },
        {
          id: 5,
          name: 'Iron Paradise',
          members: 489,
          revenue: 3120,
          plan: 'Starter',
          status: 'Active'
        },
        {
          id: 6,
          name: 'FitLife Center',
          members: 445,
          revenue: 2980,
          plan: 'Starter',
          status: 'Active'
        },
        {
          id: 7,
          name: 'CrossFit Arena',
          members: 398,
          revenue: 2560,
          plan: 'Professional',
          status: 'Active'
        },
        {
          id: 8,
          name: 'Muscle Factory',
          members: 367,
          revenue: 2340,
          plan: 'Starter',
          status: 'Pending'
        }
      ];

      this.loading = false;
      
      // Manually trigger change detection
      this.cdr.detectChanges();
      
      console.log('Data loaded:', {
        activities: this.recentActivities.length,
        gyms: this.topGyms.length
      });
    }, 800);
  }

  onActivityPageChange(page: number): void {
    console.log('Activity page changed to:', page);
    // You can add additional logic here if needed
  }

  onGymPageChange(page: number): void {
    console.log('Gym page changed to:', page);
    // You can add additional logic here if needed
  }

  viewGym(gym: TopGym): void {
    console.log('View gym:', gym);
    // Implement navigation or modal opening logic here
  }
}