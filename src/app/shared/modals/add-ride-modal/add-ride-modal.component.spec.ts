import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRideModalComponent } from './add-ride-modal.component';

describe('AddRideModalComponent', () => {
  let component: AddRideModalComponent;
  let fixture: ComponentFixture<AddRideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRideModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
