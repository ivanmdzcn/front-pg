import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioCreateComponent } from './beneficiario-create.component';

describe('BeneficiarioCreateComponent', () => {
  let component: BeneficiarioCreateComponent;
  let fixture: ComponentFixture<BeneficiarioCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiarioCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiarioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
