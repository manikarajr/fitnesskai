import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanForm } from './subscription-plan-form';

describe('SubscriptionPlanForm', () => {
  let component: SubscriptionPlanForm;
  let fixture: ComponentFixture<SubscriptionPlanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
