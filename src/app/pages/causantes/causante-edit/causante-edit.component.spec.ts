import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausanteEditComponent } from './causante-edit.component';

describe('CausanteEditComponent', () => {
  let component: CausanteEditComponent;
  let fixture: ComponentFixture<CausanteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausanteEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CausanteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
