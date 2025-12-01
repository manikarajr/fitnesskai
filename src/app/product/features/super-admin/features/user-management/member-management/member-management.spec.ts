import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberManagement } from './member-management';

describe('MemberManagement', () => {
  let component: MemberManagement;
  let fixture: ComponentFixture<MemberManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
