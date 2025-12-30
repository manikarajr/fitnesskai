import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMemberManagement } from './admin-member-management';

describe('AdminMemberManagement', () => {
  let component: AdminMemberManagement;
  let fixture: ComponentFixture<AdminMemberManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMemberManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMemberManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
