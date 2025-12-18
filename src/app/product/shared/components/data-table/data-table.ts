import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'avatar' | 'date' | 'currency' | 'actions';
  width?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  color: 'primary' | 'danger' | 'success' | 'warning';
  action: (row: any) => void;
}

export interface PaginationConfig {
  enabled: boolean;
  itemsPerPage?: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() paginationConfig: PaginationConfig = { enabled: true, itemsPerPage: 10 };
  @Input() loading = false;
  @Input() emptyMessage = 'No data available';
  @Input() selectable = false;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();
  @Output() rowSelect = new EventEmitter<any>();
  
  selectedRows: Set<any> = new Set();
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math;
  
  // Pagination signals
  currentPage = signal(1);
  itemsPerPage = signal(10);
  
  // Computed paginated data
  paginatedData = computed(() => {
    if (!this.paginationConfig.enabled) {
      return this.data;
    }
    
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.data.slice(startIndex, endIndex);
  });
  
  // Computed pagination info
  paginationInfo = computed(() => {
    const itemsPerPage = this.itemsPerPage();
    const totalItems = this.data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage: this.currentPage(),
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: itemsPerPage
    };
  });

  ngOnInit(): void {
    this.itemsPerPage.set(this.paginationConfig.itemsPerPage || 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset to page 1 when data changes
    if (changes['data'] && !changes['data'].firstChange) {
      this.currentPage.set(1);
    }
    
    // Update items per page if config changes
    if (changes['paginationConfig'] && this.paginationConfig.itemsPerPage) {
      this.itemsPerPage.set(this.paginationConfig.itemsPerPage);
    }
  }

  toggleRowSelection(row: any): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  toggleSelectAll(): void {
    const currentPageData = this.paginatedData();
    const allCurrentSelected = currentPageData.every(row => this.selectedRows.has(row));
    
    if (allCurrentSelected) {
      currentPageData.forEach(row => this.selectedRows.delete(row));
    } else {
      currentPageData.forEach(row => this.selectedRows.add(row));
    }
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  get allSelected(): boolean {
    const currentPageData = this.paginatedData();
    return currentPageData.length > 0 && currentPageData.every(row => this.selectedRows.has(row));
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
    
    this.sortChange.emit({ key: column.key, direction: this.sortDirection });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo().totalPages) return;
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  getCellValue(row: any, column: TableColumn): any {
    return row[column.key];
  }

  getBadgeClass(value: string): string {
    const lowerValue = value?.toLowerCase();
    
    if (lowerValue === 'active' || lowerValue === 'approved' || lowerValue === 'paid' || lowerValue === 'success') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
    if (lowerValue === 'inactive' || lowerValue === 'suspended' || lowerValue === 'failed') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
    if (lowerValue === 'pending' || lowerValue === 'processing') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    if (lowerValue === 'blocked' || lowerValue === 'cancelled') {
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
    
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatMobileDate(date: string | Date): string {
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}mo ago`;
    } else {
      return itemDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getActionClass(color: string): string {
    const baseClasses = 'p-2 rounded-lg transition-colors';
    
    switch (color) {
      case 'primary':
        return `${baseClasses} hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400`;
      case 'danger':
        return `${baseClasses} hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400`;
      case 'success':
        return `${baseClasses} hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400`;
      case 'warning':
        return `${baseClasses} hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400`;
      default:
        return `${baseClasses} hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400`;
    }
  }

  // Helper methods for mobile card design
  getFirstTextColumn(): TableColumn | undefined {
    return this.columns.find(col => !col.type || col.type === 'text');
  }

  getNumericColumns(): TableColumn[] {
    return this.columns.filter(col => 
      col.type !== 'avatar' && 
      col.type !== 'badge' && 
      col.type !== 'date' && 
      col.type !== 'text' &&
      col.key !== 'name' &&
      col.key !== 'owner' &&
      col.key !== 'email'
    );
  }

  getDetailColumns(): TableColumn[] {
    return this.columns.filter(col => 
      col.type !== 'avatar' && 
      col.key !== 'status' &&
      !this.getNumericColumns().includes(col) &&
      col.key !== 'name' &&
      col.key !== 'owner' &&
      col.key !== 'email'
    );
  }

  get pageNumbers(): number[] {
    const info = this.paginationInfo();
    const { currentPage, totalPages } = info;
    const delta = 2;
    const range: number[] = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift(-1);
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1);
    }
    
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range.filter((v, i, a) => a.indexOf(v) === i);
  }

  getDisplayedItemsStart(): number {
    const info = this.paginationInfo();
    return ((info.currentPage - 1) * info.itemsPerPage) + 1;
  }

  getDisplayedItemsEnd(): number {
    const info = this.paginationInfo();
    return Math.min(info.currentPage * info.itemsPerPage, info.totalItems);
  }
}