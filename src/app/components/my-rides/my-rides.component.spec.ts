import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { MyRidesComponent } from './my-rides.component';
import { GlobalService } from '../../core/services/global-service';

describe('MyRidesComponent', () => {
  let component: MyRidesComponent;
  let fixture: ComponentFixture<MyRidesComponent>;

  const mockGlobalService = {
    rides$: of([]),
    bookedRides$: of([]),
    getBookedRides: () => [],
    getOfferedRides: () => [],
    cancelBooking: jasmine.createSpy('cancelBooking'),
    cancelOfferedRide: jasmine.createSpy('cancelOfferedRide')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [MyRidesComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});