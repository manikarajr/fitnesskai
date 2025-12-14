import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PricingPlan {
  id?: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  isPopular: boolean;
  activeCount: number;
  features: string[];
  isCustom: boolean;
}

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-plan-form.html',
  styleUrl: './subscription-plan-form.scss',
})
export class SubscriptionPlanForm implements OnInit{
@Input() plan: PricingPlan | null = null;
  @Input() isEdit = false;
  @Output() save = new EventEmitter<PricingPlan>();
  @Output() cancel = new EventEmitter<void>();

  formData: PricingPlan = {
    name: '',
    price: 0,
    billingCycle: 'monthly',
    isPopular: false,
    activeCount: 0,
    features: [''],
    isCustom: false
  };

  ngOnInit(): void {
    if (this.plan) {
      this.formData = { ...this.plan, features: [...this.plan.features] };
    }
  }

  addFeature(): void {
    this.formData.features.push('');
  }

  removeFeature(index: number): void {
    if (this.formData.features.length > 1) {
      this.formData.features.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSubmit(): void {
    // Filter out empty features
    this.formData.features = this.formData.features.filter(f => f.trim() !== '');
    
    if (this.formData.features.length === 0) {
      alert('Please add at least one feature');
      return;
    }

    this.save.emit(this.formData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
