import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable, TableColumn } from '../../../../../shared/components/data-table/data-table';

interface TopMember {
  rank: number;
  name: string;
  checkIns: number;
  membershipType: string;
  lastVisit: Date;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, DataTable],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.scss',
})
export class AdminReports implements OnInit {
  loading = signal(false);
  selectedPeriod = signal('month');
  customStartDate = signal('');
  customEndDate = signal('');

  // Mock computed metrics
  totalRevenue = signal(24580);
  newMembers = signal(42);
  avgCheckIns = signal(87);
  retentionRate = signal(92);

  topMembers = signal<TopMember[]>([
    { rank: 1, name: 'Alex Johnson', checkIns: 28, membershipType: 'premium', lastVisit: new Date() },
    { rank: 2, name: 'Emma Williams', checkIns: 26, membershipType: 'vip', lastVisit: new Date() },
    { rank: 3, name: 'Oliver Smith', checkIns: 24, membershipType: 'basic', lastVisit: new Date() },
    { rank: 4, name: 'Sophia Brown', checkIns: 22, membershipType: 'premium', lastVisit: new Date() },
    { rank: 5, name: 'Liam Davis', checkIns: 20, membershipType: 'vip', lastVisit: new Date() }
  ]);

  topMembersColumns: TableColumn[] = [
    { key: 'rank', label: 'Rank', sortable: false, width: '80px' },
    { key: 'name', label: 'Member', sortable: true, width: '250px' },
    { key: 'checkIns', label: 'Check-ins', sortable: true },
    { key: 'membershipType', label: 'Plan', sortable: true, type: 'badge' },
    { key: 'lastVisit', label: 'Last Visit', sortable: true, type: 'date' }
  ];

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }

  updatePeriod(period: string): void {
    this.selectedPeriod.set(period);
    this.refreshData();
  }

  updateCustomDate(type: 'start' | 'end', value: string): void {
    if (type === 'start') {
      this.customStartDate.set(value);
    } else {
      this.customEndDate.set(value);
    }
  }

  refreshData(): void {
    console.log('Refreshing data for period:', this.selectedPeriod());
    this.loadReportData();
  }

  exportReport(): void {
    console.log('Exporting report...');
    alert('Report export feature - integrate with your backend');
  }
}