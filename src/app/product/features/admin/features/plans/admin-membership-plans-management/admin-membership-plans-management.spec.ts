import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMembershipPlansManagement } from './admin-membership-plans-management';

describe('AdminMembershipPlansManagement', () => {
  let component: AdminMembershipPlansManagement;
  let fixture: ComponentFixture<AdminMembershipPlansManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMembershipPlansManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMembershipPlansManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
