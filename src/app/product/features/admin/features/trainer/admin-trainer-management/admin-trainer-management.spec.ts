import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrainerManagement } from './admin-trainer-management';

describe('AdminTrainerManagement', () => {
  let component: AdminTrainerManagement;
  let fixture: ComponentFixture<AdminTrainerManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrainerManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTrainerManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
