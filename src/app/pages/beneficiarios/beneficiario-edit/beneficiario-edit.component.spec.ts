import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioEditComponent } from './beneficiario-edit.component';

describe('BeneficiarioEditComponent', () => {
  let component: BeneficiarioEditComponent;
  let fixture: ComponentFixture<BeneficiarioEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiarioEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
