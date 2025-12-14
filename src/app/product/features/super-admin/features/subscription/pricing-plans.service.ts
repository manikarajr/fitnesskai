import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface PricingPlanDTO {
  id: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  isPopular: boolean;
  activeCount: number;
  features: string[];
  isCustom: boolean;
}

interface PricingPlansResponse {
  plans: PricingPlanDTO[];
}

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

@Injectable({
  providedIn: 'root'
})
export class PricingPlansService {
  private http = inject(HttpClient);

  getPricingPlans(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlansResponse>('data/pricing-plans.json').pipe(
      map(response => response.plans)
    );
  }

  createPlan(plan: PricingPlan): Observable<PricingPlan> {
    // In a real application, this would make an HTTP POST request
    // For now, we'll just return the plan as an observable
    return new Observable(observer => {
      observer.next(plan);
      observer.complete();
    });
  }

  updatePlan(plan: PricingPlan): Observable<PricingPlan> {
    // In a real application, this would make an HTTP PUT request
    return new Observable(observer => {
      observer.next(plan);
      observer.complete();
    });
  }

  deletePlan(planId: number): Observable<void> {
    // In a real application, this would make an HTTP DELETE request
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}