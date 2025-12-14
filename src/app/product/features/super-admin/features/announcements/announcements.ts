import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OffcanvasPanel } from '../../../../shared/components/offcanvas-panel/offcanvas-panel';


interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  targetAudience: string[];
  scheduledDate?: Date;
  createdAt: Date;
  status: 'draft' | 'published' | 'scheduled';
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OffcanvasPanel],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss',
})
export class Announcements {
  isFormOpen = signal(false);
  announcementForm: FormGroup;
  isEditMode = signal(false);
  currentAnnouncementId = signal<string | null>(null);

  announcementTypes = [
    { value: 'info', label: 'Information', color: 'blue' },
    { value: 'success', label: 'Success', color: 'green' },
    { value: 'warning', label: 'Warning', color: 'yellow' },
    { value: 'danger', label: 'Important', color: 'red' }
  ];

  audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'admins', label: 'Gym Admins' },
    { value: 'trainers', label: 'Trainers' },
    { value: 'members', label: 'Members' }
  ];

  announcements = signal<Announcement[]>([
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Dec 15, 2024 from 2 AM to 4 AM EST.',
      type: 'info',
      targetAudience: ['all'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'published'
    },
    {
      id: '2',
      title: 'New Feature Release',
      message: 'Introducing advanced analytics dashboard for all Professional tier users.',
      type: 'success',
      targetAudience: ['admins'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'published'
    },
    {
      id: '3',
      title: 'Policy Update',
      message: 'Updated terms of service. Please review the changes in your admin panel.',
      type: 'warning',
      targetAudience: ['all'],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: 'published'
    }
  ]);

  constructor(private fb: FormBuilder) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      type: ['info', Validators.required],
      targetAudience: [['all'], Validators.required],
      scheduledDate: [''],
      status: ['published', Validators.required]
    });
  }

  openForm(announcement?: Announcement): void {
    if (announcement) {
      this.isEditMode.set(true);
      this.currentAnnouncementId.set(announcement.id);
      this.announcementForm.patchValue({
        title: announcement.title,
        message: announcement.message,
        type: announcement.type,
        targetAudience: announcement.targetAudience,
        scheduledDate: announcement.scheduledDate 
          ? new Date(announcement.scheduledDate).toISOString().slice(0, 16) 
          : '',
        status: announcement.status
      });
    } else {
      this.isEditMode.set(false);
      this.currentAnnouncementId.set(null);
      this.announcementForm.reset({
        type: 'info',
        targetAudience: ['all'],
        status: 'published'
      });
    }
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.announcementForm.reset();
    this.isEditMode.set(false);
    this.currentAnnouncementId.set(null);
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      
      if (this.isEditMode() && this.currentAnnouncementId()) {
        // Update existing announcement
        this.announcements.update(announcements => 
          announcements.map(a => 
            a.id === this.currentAnnouncementId() 
              ? { 
                  ...a, 
                  ...formValue,
                  scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate) : undefined
                }
              : a
          )
        );
      } else {
        // Create new announcement
        const newAnnouncement: Announcement = {
          id: Date.now().toString(),
          title: formValue.title,
          message: formValue.message,
          type: formValue.type,
          targetAudience: formValue.targetAudience,
          scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate) : undefined,
          createdAt: new Date(),
          status: formValue.status
        };
        
        this.announcements.update(announcements => [newAnnouncement, ...announcements]);
      }
      
      this.closeForm();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.announcementForm.controls).forEach(key => {
        this.announcementForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteAnnouncement(id: string): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcements.update(announcements => 
        announcements.filter(a => a.id !== id)
      );
    }
  }

  getTypeColor(type: string): string {
    const typeConfig = this.announcementTypes.find(t => t.value === type);
    return typeConfig?.color || 'blue';
  }

  getAudienceLabel(audience: string[]): string {
    return audience.map(a => 
      this.audienceOptions.find(opt => opt.value === a)?.label || a
    ).join(', ');
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  }

  toggleAudience(audience: string): void {
    const currentAudience = this.announcementForm.get('targetAudience')?.value || [];
    
    if (audience === 'all') {
      this.announcementForm.patchValue({ targetAudience: ['all'] });
    } else {
      const filtered = currentAudience.filter((a: string) => a !== 'all');
      
      if (filtered.includes(audience)) {
        const updated = filtered.filter((a: string) => a !== audience);
        this.announcementForm.patchValue({ 
          targetAudience: updated.length > 0 ? updated : ['all'] 
        });
      } else {
        this.announcementForm.patchValue({ 
          targetAudience: [...filtered, audience] 
        });
      }
    }
  }

  isAudienceSelected(audience: string): boolean {
    const currentAudience = this.announcementForm.get('targetAudience')?.value || [];
    return currentAudience.includes(audience);
  }
}