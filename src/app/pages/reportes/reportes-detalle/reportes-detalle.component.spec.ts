import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDetalleComponent } from './reportes-detalle.component';

describe('ReportesDetalleComponent', () => {
  let component: ReportesDetalleComponent;
  let fixture: ComponentFixture<ReportesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
