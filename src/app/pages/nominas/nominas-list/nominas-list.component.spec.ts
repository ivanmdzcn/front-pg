import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasListComponent } from './nominas-list.component';

describe('NominasListComponent', () => {
  let component: NominasListComponent;
  let fixture: ComponentFixture<NominasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
