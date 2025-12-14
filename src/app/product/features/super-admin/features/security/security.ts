import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable, PaginationData, TableAction, TableColumn } from '../../../../shared/components/data-table/data-table';


interface SecurityLog {
  id: string;
  timestamp: Date;
  eventType: string;
  user: string;
  email: string;
  ipAddress: string;
  location: string;
  device: string;
  status: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityStats {
  loginAttempts: number;
  failedLogins: number;
  blockedIps: number;
  suspiciousActivity: number;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable],
  templateUrl: './security.html',
  styleUrl: './security.scss',
})
export class Security implements OnInit, OnDestroy {
  // Table configuration
  columns: TableColumn[] = [
    { key: 'timestamp', label: 'Timestamp', sortable: true, type: 'date' },
    { key: 'eventType', label: 'Event Type', sortable: true, type: 'badge' },
    { key: 'user', label: 'User', sortable: true, type: 'text' },
    { key: 'status', label: 'Status', sortable: true, type: 'badge' },
    { key: 'details', label: 'Details', sortable: false, type: 'text' }
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'view',
      color: 'primary',
      action: (row) => this.viewDetails(row)
    },
    {
      label: 'Block IP',
      icon: 'block',
      color: 'danger',
      action: (row) => this.blockIP(row)
    }
  ];

  // Data
  allLogs: SecurityLog[] = [];
  filteredLogs: SecurityLog[] = [];
  displayedLogs: SecurityLog[] = [];
  
  // Filters
  searchQuery: string = '';
  selectedEventType: string = 'all';
  selectedStatus: string = 'all';
  selectedSeverity: string = 'all';
  dateRange: string = 'today';

  eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'Login', label: 'Login' },
    { value: 'Logout', label: 'Logout' },
    { value: 'Failed Login', label: 'Failed Login' },
    { value: 'Password Change', label: 'Password Change' },
    { value: 'Account Update', label: 'Account Update' },
    { value: 'IP Blocked', label: 'IP Blocked' },
    { value: 'Data Export', label: 'Data Export' },
    { value: 'Settings Change', label: 'Settings Change' }
  ];

  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Success', label: 'Success' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Blocked', label: 'Blocked' },
    { value: 'Pending', label: 'Pending' }
  ];

  severityOptions = [
    { value: 'all', label: 'All Severity' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  // Stats
  stats: SecurityStats = {
    loginAttempts: 0,
    failedLogins: 0,
    blockedIps: 0,
    suspiciousActivity: 0
  };

  // Pagination
  pagination: PaginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  // Loading state
  loading = false;

  // Real-time simulation
  private updateInterval: any;

  ngOnInit(): void {
    this.generateMockData();
    this.applyFilters();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  generateMockData(): void {
    const users = [
      { name: 'John Smith', email: 'john@powerhouse.com' },
      { name: 'Sarah Johnson', email: 'sarah@powerhouse.com' },
      { name: 'Mike Davis', email: 'mike@powerhouse.com' },
      { name: 'Emily Brown', email: 'emily@powerhouse.com' },
      { name: 'David Wilson', email: 'david@powerhouse.com' },
      { name: 'Unknown User', email: 'unknown@email.com' }
    ];

    const eventTypes = ['Login', 'Logout', 'Failed Login', 'Password Change', 'Account Update', 'IP Blocked', 'Data Export', 'Settings Change'];
    const statuses = ['Success', 'Failed', 'Blocked', 'Pending'];
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const devices = ['Chrome on Windows', 'Safari on MacOS', 'Firefox on Linux', 'Mobile App - iOS', 'Mobile App - Android'];
    const locations = ['New York, US', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Mumbai, India', 'Unknown Location'];

    this.allLogs = Array.from({ length: 150 }, (_, i) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const status = eventType === 'Failed Login' || eventType === 'IP Blocked' 
        ? (Math.random() > 0.5 ? 'Failed' : 'Blocked')
        : (Math.random() > 0.8 ? 'Pending' : 'Success');
      
      const severity = eventType === 'IP Blocked' ? 'critical' 
        : eventType === 'Failed Login' ? 'high'
        : eventType === 'Password Change' ? 'medium'
        : 'low';

      const hoursAgo = Math.floor(Math.random() * 72);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      return {
        id: `LOG-${1000 + i}`,
        timestamp: new Date(Date.now() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000)),
        eventType,
        user: user.name,
        email: user.email,
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        status,
        details: this.generateDetails(eventType, status),
        severity
      };
    });

    // Sort by timestamp (newest first)
    this.allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    this.calculateStats();
  }

  generateDetails(eventType: string, status: string): string {
    const details: { [key: string]: string[] } = {
      'Login': ['Successful login from trusted device', 'Login from new location detected', 'Two-factor authentication verified'],
      'Logout': ['User logged out successfully', 'Session expired', 'Forced logout by admin'],
      'Failed Login': ['Incorrect password attempt', 'Account locked after multiple attempts', 'Suspicious login pattern detected'],
      'Password Change': ['Password updated successfully', 'Password reset requested', 'Strong password policy enforced'],
      'Account Update': ['Profile information updated', 'Email address changed', 'Phone number verified'],
      'IP Blocked': ['Too many failed login attempts', 'Suspicious activity detected', 'Geographic restriction applied'],
      'Data Export': ['Member data exported', 'Financial report generated', 'Audit log downloaded'],
      'Settings Change': ['System configuration modified', 'Security settings updated', 'Notification preferences changed']
    };

    const eventDetails = details[eventType] || ['Activity logged'];
    return eventDetails[Math.floor(Math.random() * eventDetails.length)];
  }

  calculateStats(): void {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = this.allLogs.filter(log => log.timestamp >= last24Hours);

    this.stats = {
      loginAttempts: recentLogs.filter(log => log.eventType === 'Login' || log.eventType === 'Failed Login').length,
      failedLogins: recentLogs.filter(log => log.eventType === 'Failed Login').length,
      blockedIps: recentLogs.filter(log => log.status === 'Blocked').length,
      suspiciousActivity: recentLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length
    };
  }

  applyFilters(): void {
    this.loading = true;

    setTimeout(() => {
      let filtered = [...this.allLogs];

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(log => 
          log.user.toLowerCase().includes(query) ||
          log.email.toLowerCase().includes(query) ||
          log.ipAddress.toLowerCase().includes(query) ||
          log.eventType.toLowerCase().includes(query) ||
          log.details.toLowerCase().includes(query)
        );
      }

      // Event type filter
      if (this.selectedEventType !== 'all') {
        filtered = filtered.filter(log => log.eventType === this.selectedEventType);
      }

      // Status filter
      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(log => log.status === this.selectedStatus);
      }

      // Severity filter
      if (this.selectedSeverity !== 'all') {
        filtered = filtered.filter(log => log.severity === this.selectedSeverity);
      }

      // Date range filter
      const now = Date.now();
      if (this.dateRange === 'today') {
        const todayStart = new Date().setHours(0, 0, 0, 0);
        filtered = filtered.filter(log => log.timestamp.getTime() >= todayStart);
      } else if (this.dateRange === 'yesterday') {
        const yesterdayStart = new Date(now - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(now - 24 * 60 * 60 * 1000).setHours(23, 59, 59, 999);
        filtered = filtered.filter(log => 
          log.timestamp.getTime() >= yesterdayStart && log.timestamp.getTime() <= yesterdayEnd
        );
      } else if (this.dateRange === 'week') {
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter(log => log.timestamp.getTime() >= weekAgo);
      } else if (this.dateRange === 'month') {
        const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter(log => log.timestamp.getTime() >= monthAgo);
      }

      this.filteredLogs = filtered;
      this.pagination.totalItems = filtered.length;
      this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.itemsPerPage);
      this.pagination.currentPage = 1;
      
      this.updateDisplayedLogs();
      this.loading = false;
    }, 300);
  }

  updateDisplayedLogs(): void {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    this.displayedLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.pagination.currentPage = page;
    this.updateDisplayedLogs();
  }

  onSortChange(sort: { key: string; direction: 'asc' | 'desc' }): void {
    this.filteredLogs.sort((a: any, b: any) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    this.updateDisplayedLogs();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedEventType = 'all';
    this.selectedStatus = 'all';
    this.selectedSeverity = 'all';
    this.dateRange = 'today';
    this.applyFilters();
  }

  viewDetails(log: SecurityLog): void {
    alert(`Security Log Details\n\n` +
      `ID: ${log.id}\n` +
      `Event: ${log.eventType}\n` +
      `User: ${log.user} (${log.email})\n` +
      `Status: ${log.status}\n` +
      `IP Address: ${log.ipAddress}\n` +
      `Location: ${log.location}\n` +
      `Device: ${log.device}\n` +
      `Severity: ${log.severity.toUpperCase()}\n` +
      `Timestamp: ${log.timestamp.toLocaleString()}\n` +
      `Details: ${log.details}`
    );
  }

  blockIP(log: SecurityLog): void {
    if (confirm(`Are you sure you want to block IP address ${log.ipAddress}?`)) {
      // Simulate blocking IP
      console.log(`Blocking IP: ${log.ipAddress}`);
      this.stats.blockedIps++;
      
      // Add new blocked IP log
      const newLog: SecurityLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date(),
        eventType: 'IP Blocked',
        user: 'System Admin',
        email: 'admin@powerhouse.com',
        ipAddress: log.ipAddress,
        location: log.location,
        device: 'Admin Console',
        status: 'Blocked',
        details: `IP address blocked manually by admin`,
        severity: 'critical'
      };

      this.allLogs.unshift(newLog);
      this.applyFilters();
    }
  }

  exportLogs(): void {
    console.log('Exporting logs...', this.filteredLogs);
    alert(`Exporting ${this.filteredLogs.length} security logs to CSV...`);
  }

  startRealTimeUpdates(): void {
    // Simulate real-time log updates every 10 seconds
    this.updateInterval = setInterval(() => {
      const shouldAddLog = Math.random() > 0.5;
      
      if (shouldAddLog) {
        this.addRealTimeLog();
        this.calculateStats();
        if (this.dateRange === 'today' || this.dateRange === 'all') {
          this.applyFilters();
        }
      }
    }, 10000);
  }

  addRealTimeLog(): void {
    const users = [
      { name: 'John Smith', email: 'john@powerhouse.com' },
      { name: 'Sarah Johnson', email: 'sarah@powerhouse.com' },
      { name: 'Mike Davis', email: 'mike@powerhouse.com' }
    ];

    const eventTypes = ['Login', 'Logout', 'Failed Login', 'Account Update'];
    const user = users[Math.floor(Math.random() * users.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newLog: SecurityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date(),
      eventType,
      user: user.name,
      email: user.email,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: 'New York, US',
      device: 'Chrome on Windows',
      status: eventType === 'Failed Login' ? 'Failed' : 'Success',
      details: this.generateDetails(eventType, eventType === 'Failed Login' ? 'Failed' : 'Success'),
      severity: eventType === 'Failed Login' ? 'high' : 'low'
    };

    this.allLogs.unshift(newLog);
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  }

  getEventTypeLabel(): string {
    return this.eventTypes.find(e => e.value === this.selectedEventType)?.label || '';
  }

  getStatusLabel(): string {
    return this.statusOptions.find(s => s.value === this.selectedStatus)?.label || '';
  }

  getSeverityLabel(): string {
    return this.severityOptions.find(s => s.value === this.selectedSeverity)?.label || '';
  }

  getDateRangeLabel(): string {
    return this.dateRanges.find(d => d.value === this.dateRange)?.label || '';
  }
}