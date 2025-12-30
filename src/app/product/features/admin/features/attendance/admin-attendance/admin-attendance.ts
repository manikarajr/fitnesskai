import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataTable, PaginationConfig, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table';
import { OffcanvasPanel } from '../../../../../shared/components/offcanvas-panel/offcanvas-panel';

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  membershipType: string;
  checkInTime: Date;
  checkOutTime?: Date;
  duration?: string;
  notes?: string;
}

interface Member {
  id: string;
  name: string;
  membershipType: string;
}

interface Filters {
  search: string;
  date: string;
  period: string;
}

@Component({
  selector: 'app-admin-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTable, OffcanvasPanel],
  templateUrl: './admin-attendance.html',
  styleUrl: './admin-attendance.scss',
})
export class AdminAttendance implements OnInit {
  private allAttendance = signal<AttendanceRecord[]>([]);
  filters = signal<Filters>({ search: '', date: '', period: '' });
  loading = signal(false);
  submitting = signal(false);
  isPanelOpen = signal(false);
  
  activeMembers = signal<Member[]>([
    { id: '1', name: 'Alex Johnson', membershipType: 'premium' },
    { id: '2', name: 'Emma Williams', membershipType: 'vip' },
    { id: '3', name: 'Oliver Smith', membershipType: 'basic' },
    { id: '4', name: 'Sophia Brown', membershipType: 'premium' },
    { id: '5', name: 'Liam Davis', membershipType: 'vip' }
  ]);

  todayCheckIns = computed(() => {
    const today = new Date().toDateString();
    return this.allAttendance().filter(a => 
      new Date(a.checkInTime).toDateString() === today
    ).length;
  });

  weekCheckIns = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.allAttendance().filter(a => 
      new Date(a.checkInTime) >= weekAgo
    ).length;
  });

  monthCheckIns = computed(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return this.allAttendance().filter(a => 
      new Date(a.checkInTime) >= monthAgo
    ).length;
  });

  avgDaily = computed(() => {
    const days = 30;
    return Math.round(this.monthCheckIns() / days);
  });

  paginationConfig = signal<PaginationConfig>({
    enabled: true,
    itemsPerPage: 8
  });

  filteredAttendance = computed(() => {
    let filtered = [...this.allAttendance()];
    const currentFilters = this.filters();

    if (currentFilters.search) {
      const search = currentFilters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.memberName.toLowerCase().includes(search)
      );
    }

    if (currentFilters.date) {
      const selectedDate = new Date(currentFilters.date).toDateString();
      filtered = filtered.filter(a => 
        new Date(a.checkInTime).toDateString() === selectedDate
      );
    }

    if (currentFilters.period) {
      const now = new Date();
      filtered = filtered.filter(a => {
        const checkIn = new Date(a.checkInTime);
        switch (currentFilters.period) {
          case 'today':
            return checkIn.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return checkIn >= weekAgo;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return checkIn >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    );
  });

  columns: TableColumn[] = [
    { key: 'memberName', label: 'Member', sortable: true, width: '250px' },
    { key: 'membershipType', label: 'Plan', sortable: true, type: 'badge' },
    { key: 'checkInTime', label: 'Check-in', sortable: true, type: 'date' },
    { key: 'checkOutTime', label: 'Check-out', sortable: true, type: 'date' },
    { key: 'duration', label: 'Duration', sortable: false },
    { key: 'notes', label: 'Notes', sortable: false }
  ];

  tableActions: TableAction[] = [
    { label: 'View', icon: 'view', color: 'success', action: (row) => this.viewRecord(row) },
    { label: 'Delete', icon: 'delete', color: 'danger', action: (row) => this.deleteRecord(row) }
  ];

  attendanceForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  initForm(): void {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.attendanceForm = this.fb.group({
      memberId: ['', Validators.required],
      checkInTime: [localDateTime, Validators.required],
      notes: ['']
    });
  }

  loadMockData(): void {
    this.loading.set(true);

    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        memberId: '1',
        memberName: 'Alex Johnson',
        membershipType: 'premium',
        checkInTime: new Date(new Date().setHours(8, 30)),
        checkOutTime: new Date(new Date().setHours(10, 0)),
        duration: '1h 30m'
      },
      {
        id: '2',
        memberId: '2',
        memberName: 'Emma Williams',
        membershipType: 'vip',
        checkInTime: new Date(new Date().setHours(9, 0)),
        checkOutTime: new Date(new Date().setHours(11, 30)),
        duration: '2h 30m'
      },
      {
        id: '3',
        memberId: '3',
        memberName: 'Oliver Smith',
        membershipType: 'basic',
        checkInTime: new Date(new Date().setHours(6, 0)),
        checkOutTime: new Date(new Date().setHours(7, 30)),
        duration: '1h 30m'
      }
    ];

    setTimeout(() => {
      this.allAttendance.set(mockData);
      this.loading.set(false);
    }, 500);
  }

  updateFilter(key: keyof Filters, value: string): void {
    this.filters.update(current => ({ ...current, [key]: value }));
  }

  resetFilters(): void {
    this.filters.set({ search: '', date: '', period: '' });
  }

  openMarkAttendancePanel(): void {
    this.initForm();
    this.isPanelOpen.set(true);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
    this.attendanceForm.reset();
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) return;

    this.submitting.set(true);
    const formData = this.attendanceForm.value;
    const member = this.activeMembers().find(m => m.id === formData.memberId);

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      memberId: formData.memberId,
      memberName: member?.name || '',
      membershipType: member?.membershipType || '',
      checkInTime: new Date(formData.checkInTime),
      notes: formData.notes
    };

    setTimeout(() => {
      this.allAttendance.update(current => [newRecord, ...current]);
      this.submitting.set(false);
      this.closePanel();
    }, 1000);
  }

  viewRecord(record: AttendanceRecord): void {
    console.log('View record:', record);
  }

  deleteRecord(record: AttendanceRecord): void {
    if (confirm(`Delete this attendance record?`)) {
      this.allAttendance.update(current => current.filter(a => a.id !== record.id));
    }
  }

  onPageChange(page: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort:', event);
  }

  onRowSelect(selectedRows: AttendanceRecord[]): void {
    console.log('Selected rows:', selectedRows);
  }
}