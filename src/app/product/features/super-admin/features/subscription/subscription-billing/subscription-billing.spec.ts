import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBilling } from './subscription-billing';

describe('SubscriptionBilling', () => {
  let component: SubscriptionBilling;
  let fixture: ComponentFixture<SubscriptionBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionBilling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
