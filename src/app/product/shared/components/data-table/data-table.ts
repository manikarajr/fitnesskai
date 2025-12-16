import { Component, Input, Output, EventEmitter } from '@angular/core';
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

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() pagination?: PaginationData;
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

  toggleRowSelection(row: any): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  toggleSelectAll(): void {
    if (this.selectedRows.size === this.data.length) {
      this.selectedRows.clear();
    } else {
      this.data.forEach(row => this.selectedRows.add(row));
    }
    this.rowSelect.emit(Array.from(this.selectedRows));
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.size === this.data.length;
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
    if (!this.pagination) return [];
    
    const { currentPage, totalPages } = this.pagination;
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
    if (!this.pagination) return 0;
    return ((this.pagination.currentPage - 1) * this.pagination.itemsPerPage) + 1;
  }

  getDisplayedItemsEnd(): number {
    if (!this.pagination) return 0;
    return Math.min(this.pagination.currentPage * this.pagination.itemsPerPage, this.pagination.totalItems);
  }
}