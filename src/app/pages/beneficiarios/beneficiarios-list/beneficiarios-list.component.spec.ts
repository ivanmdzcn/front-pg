import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariosListComponent } from './beneficiarios-list.component';

describe('BeneficiariosListComponent', () => {
  let component: BeneficiariosListComponent;
  let fixture: ComponentFixture<BeneficiariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiariosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
