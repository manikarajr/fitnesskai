import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

interface SettingsTab {
  id: string;
  label: string;
}

interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface NotificationPref {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings implements OnInit {
  activeTab = signal('general');
  savingGeneral = signal(false);
  savingHours = signal(false);
  savingNotifications = signal(false);
  savingSecurity = signal(false);

  settingsTabs: SettingsTab[] = [
    { id: 'general', label: 'General' },
    { id: 'hours', label: 'Business Hours' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' }
  ];

  businessHours = signal<BusinessHour[]>([
    { day: 'Monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Friday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
    { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'Sunday', isOpen: false, openTime: '08:00', closeTime: '18:00' }
  ]);

  notificationPrefs = signal<NotificationPref[]>([
    {
      id: 'new_member',
      title: 'New Member Registration',
      description: 'Get notified when a new member joins',
      enabled: true
    },
    {
      id: 'payment_received',
      title: 'Payment Received',
      description: 'Get notified when payments are received',
      enabled: true
    },
    {
      id: 'membership_expiry',
      title: 'Membership Expiring',
      description: 'Get notified 7 days before membership expires',
      enabled: true
    },
    {
      id: 'low_attendance',
      title: 'Low Attendance Alert',
      description: 'Get notified when member attendance drops',
      enabled: false
    },
    {
      id: 'daily_report',
      title: 'Daily Summary Report',
      description: 'Receive daily gym activity summary',
      enabled: true
    }
  ]);

  generalForm!: FormGroup;
  securityForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initForms(): void {
    this.generalForm = this.fb.group({
      gymName: ['FitnessKai Gym', Validators.required],
      email: ['admin@fitnesskai.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567'],
      website: ['https://fitnesskai.com'],
      address: ['123 Fitness Street, Gym City, GC 12345']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  loadSettings(): void {
    // Load settings from backend
    console.log('Loading settings...');
  }

  resetGeneralForm(): void {
    this.generalForm.reset({
      gymName: 'FitnessKai Gym',
      email: 'admin@fitnesskai.com',
      phone: '+1 (555) 123-4567',
      website: 'https://fitnesskai.com',
      address: '123 Fitness Street, Gym City, GC 12345'
    });
  }

  saveGeneralSettings(): void {
    if (this.generalForm.invalid) return;

    this.savingGeneral.set(true);
    console.log('Saving general settings:', this.generalForm.value);

    setTimeout(() => {
      this.savingGeneral.set(false);
      alert('General settings saved successfully!');
    }, 1000);
  }

  saveBusinessHours(): void {
    this.savingHours.set(true);
    console.log('Saving business hours:', this.businessHours());

    setTimeout(() => {
      this.savingHours.set(false);
      alert('Business hours saved successfully!');
    }, 1000);
  }

  saveNotificationPrefs(): void {
    this.savingNotifications.set(true);
    console.log('Saving notification preferences:', this.notificationPrefs());

    setTimeout(() => {
      this.savingNotifications.set(false);
      alert('Notification preferences saved successfully!');
    }, 1000);
  }

  changePassword(): void {
    if (this.securityForm.invalid) return;

    const { newPassword, confirmPassword } = this.securityForm.value;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.savingSecurity.set(true);
    console.log('Changing password...');

    setTimeout(() => {
      this.savingSecurity.set(false);
      this.securityForm.reset();
      alert('Password changed successfully!');
    }, 1000);
  }
}