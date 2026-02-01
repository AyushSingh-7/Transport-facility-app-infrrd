import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookRideModalComponent } from './book-ride-modal.component';
import { GlobalService } from '../../../core/services/global-service';
import { RideData } from '@shared/models/data-models';

describe('BookRideModalComponent', () => {
  let component: BookRideModalComponent;
  let fixture: ComponentFixture<BookRideModalComponent>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;

  const mockRide: RideData = {
    id: 'ride-123',
    vehicleType: 'car',
    from: 'Koramangala',
    to: 'Whitefield',
    departureTime: '09:00',
    availableSeats: 4,
    offerBy: 'EMP001',
    vehicleNumber: 'KA01AB1234',
    rideId: ''
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GlobalService', ['hasEmployeeAlreadyBookedRide', 'bookRide']);
    spy.hasEmployeeAlreadyBookedRide.and.returnValue(false);
    spy.bookRide.and.returnValue({ id: 'booking-123', rideId: 'ride-123', passengerEmployeeId: 'EMP002', seatsBooked: 1 });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [BookRideModalComponent],
      providers: [{ provide: GlobalService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(BookRideModalComponent);
    component = fixture.componentInstance;
    component.ride = mockRide;
    globalServiceSpy = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with employeeId control', () => {
      expect(component.bookRideForm).toBeTruthy();
      expect(component.bookRideForm.get('employeeId')).toBeTruthy();
    });

    it('should set totalSeats based on vehicle type', () => {
      expect(component.totalSeats.length).toBe(6); // car
    });

    it('should set totalSeats to 1 for bike', () => {
      component.ride = { ...mockRide, vehicleType: 'bike' };
      component.ngOnInit();
      expect(component.totalSeats.length).toBe(1);
    });
  });

  describe('Employee ID Validation', () => {
    it('should be invalid when empty', () => {
      const control = component.bookRideForm.get('employeeId');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTrue();
    });

    it('should be invalid when less than 3 characters', () => {
      const control = component.bookRideForm.get('employeeId');
      control?.setValue('AB');
      expect(control?.hasError('minlength')).toBeTrue();
    });

    it('should be valid with proper employee ID', () => {
      const control = component.bookRideForm.get('employeeId');
      control?.setValue('EMP002');
      expect(control?.valid).toBeTrue();
    });
  });

  describe('Booking Validation', () => {
    it('should show error when trying to book own ride', () => {
      component.bookRideForm.patchValue({ employeeId: 'EMP001' }); // Same as offerBy
      component.onSubmit();
      expect(component.bookingError).toBe('Cannot book your own ride');
    });

    it('should show error when already booked this ride', () => {
      globalServiceSpy.hasEmployeeAlreadyBookedRide.and.returnValue(true);
      component.bookRideForm.patchValue({ employeeId: 'EMP002' });
      component.onSubmit();
      expect(component.bookingError).toBe('You have already booked this ride');
    });

    it('should clear error when employee ID changes', () => {
      component.bookingError = 'Some error';
      component.onEmployeeIdChange();
      expect(component.bookingError).toBe('');
    });
  });

  describe('Successful Booking', () => {
    it('should emit bookingResult on successful booking', () => {
      spyOn(component.bookingResult, 'emit');
      component.bookRideForm.patchValue({ employeeId: 'EMP002' });
      component.onSubmit();
      expect(component.bookingResult.emit).toHaveBeenCalled();
    });

    it('should emit submit on successful booking', () => {
      spyOn(component.submit, 'emit');
      component.bookRideForm.patchValue({ employeeId: 'EMP002' });
      component.onSubmit();
      expect(component.submit.emit).toHaveBeenCalled();
    });

    it('should call globalService.bookRide on successful booking', () => {
      component.bookRideForm.patchValue({ employeeId: 'EMP002' });
      component.onSubmit();
      expect(globalServiceSpy.bookRide).toHaveBeenCalledWith('ride-123', 'EMP002', 1);
    });
  });

  describe('Event Emitters', () => {
    it('should emit close event when onClose is called', () => {
      spyOn(component.close, 'emit');
      component.onClose();
      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
