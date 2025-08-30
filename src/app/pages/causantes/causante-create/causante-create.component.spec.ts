import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausanteCreateComponent } from './causante-create.component';

describe('CausanteCreateComponent', () => {
  let component: CausanteCreateComponent;
  let fixture: ComponentFixture<CausanteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausanteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CausanteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
