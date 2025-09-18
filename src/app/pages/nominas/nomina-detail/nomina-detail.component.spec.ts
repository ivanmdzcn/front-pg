import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominaDetailComponent } from './nomina-detail.component';

describe('NominaDetailComponent', () => {
  let component: NominaDetailComponent;
  let fixture: ComponentFixture<NominaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
