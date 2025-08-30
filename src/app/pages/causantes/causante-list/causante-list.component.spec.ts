import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausanteListComponent } from './causante-list.component';

describe('CausanteListComponent', () => {
  let component: CausanteListComponent;
  let fixture: ComponentFixture<CausanteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausanteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CausanteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
