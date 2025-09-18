import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominaNewComponent } from './nomina-new.component';

describe('NominaNewComponent', () => {
  let component: NominaNewComponent;
  let fixture: ComponentFixture<NominaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominaNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
