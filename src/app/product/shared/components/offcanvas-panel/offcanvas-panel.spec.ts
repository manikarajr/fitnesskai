import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcanvasPanel } from './offcanvas-panel';

describe('OffcanvasPanel', () => {
  let component: OffcanvasPanel;
  let fixture: ComponentFixture<OffcanvasPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffcanvasPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffcanvasPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
