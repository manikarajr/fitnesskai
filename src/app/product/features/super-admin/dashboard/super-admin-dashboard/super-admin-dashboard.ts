import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../shared/components/data-table/data-table';



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
  imports: [CommonModule, StatsCard, DataTable],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.scss'
})
export class SuperAdminDashboard implements OnInit {
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

  activityPagination: PaginationData = {
    currentPage: 1,
    totalPages: 3,
    totalItems: 25,
    itemsPerPage: 10
  };

  loading = false;

  ngOnInit(): void {
    this.loadRecentActivities();
    this.loadTopGyms();
  }

  loadRecentActivities(): void {
    this.recentActivities = [
      {
        id: 1,
        type: 'New Gym',
        description: 'FitZone Downtown registered',
        timestamp: new Date('2024-11-29T10:30:00'),
        status: 'Pending'
      },
      {
        id: 2,
        type: 'Payment',
        description: 'PowerHouse Gym renewed subscription',
        timestamp: new Date('2024-11-29T09:15:00'),
        status: 'Success'
      },
      {
        id: 3,
        type: 'Support',
        description: 'Elite Fitness raised a support ticket',
        timestamp: new Date('2024-11-29T08:45:00'),
        status: 'Active'
      },
      {
        id: 4,
        type: 'Upgrade',
        description: 'Metro Gym upgraded to Professional',
        timestamp: new Date('2024-11-28T16:20:00'),
        status: 'Success'
      },
      {
        id: 5,
        type: 'New Gym',
        description: 'CrossFit Arena submitted application',
        timestamp: new Date('2024-11-28T14:10:00'),
        status: 'Approved'
      }
    ];
  }

  loadTopGyms(): void {
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
      }
    ];
  }

  onActivityPageChange(page: number): void {
    this.activityPagination.currentPage = page;
    this.loadRecentActivities();
  }

  viewGym(gym: TopGym): void {
    console.log('View gym:', gym);
  }
}