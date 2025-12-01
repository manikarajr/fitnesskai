import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymManagement } from './gym-management';

describe('GymManagement', () => {
  let component: GymManagement;
  let fixture: ComponentFixture<GymManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
