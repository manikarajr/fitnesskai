import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerLayout } from './trainer-layout';

describe('TrainerLayout', () => {
  let component: TrainerLayout;
  let fixture: ComponentFixture<TrainerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
