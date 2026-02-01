import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddRideModalComponent } from './add-ride-modal.component';
import { GlobalService } from 'src/app/core/services/global-service';

describe('AddRideModalComponent', () => {
  let component: AddRideModalComponent;
  let fixture: ComponentFixture<AddRideModalComponent>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GlobalService', ['hasEmployeeAlreadyOfferedRide']);
    spy.hasEmployeeAlreadyOfferedRide.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [AddRideModalComponent],
      providers: [{ provide: GlobalService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideModalComponent);
    component = fixture.componentInstance;
    globalServiceSpy = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.addRideForm).toBeTruthy();
      expect(component.addRideForm.get('vehicleType')?.value).toBe('car');
      expect(component.addRideForm.get('availableSeats')?.value).toBe(1);
    });

    it('should have all required form controls', () => {
      expect(component.addRideForm.get('employeeId')).toBeTruthy();
      expect(component.addRideForm.get('vehicleType')).toBeTruthy();
      expect(component.addRideForm.get('vehicleNumber')).toBeTruthy();
      expect(component.addRideForm.get('availableSeats')).toBeTruthy();
      expect(component.addRideForm.get('departureTime')).toBeTruthy();
      expect(component.addRideForm.get('pickupPoint')).toBeTruthy();
      expect(component.addRideForm.get('destination')).toBeTruthy();
    });
  });

  describe('Employee ID Validation', () => {
    it('should be invalid when empty', () => {
      const control = component.addRideForm.get('employeeId');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTrue();
    });

    it('should be invalid when less than 3 characters', () => {
      const control = component.addRideForm.get('employeeId');
      control?.setValue('AB');
      expect(control?.hasError('minlength')).toBeTrue();
    });

    it('should be valid with proper employee ID', () => {
      const control = component.addRideForm.get('employeeId');
      control?.setValue('EMP001');
      expect(control?.valid).toBeTrue();
    });
  });

  describe('Vehicle Number Validation (Indian Number Plates)', () => {
    it('should accept standard format (KA01AB1234)', () => {
      const control = component.addRideForm.get('vehicleNumber');
      control?.setValue('KA01AB1234');
      expect(control?.hasError('invalidIndianNumberPlate')).toBeFalse();
    });

    it('should accept Bharat series format (23BH1234AB)', () => {
      const control = component.addRideForm.get('vehicleNumber');
      control?.setValue('23BH1234AB');
      expect(control?.hasError('invalidIndianNumberPlate')).toBeFalse();
    });

    it('should accept electric vehicle format (DL12EV1234)', () => {
      const control = component.addRideForm.get('vehicleNumber');
      control?.setValue('DL12EV1234');
      expect(control?.hasError('invalidIndianNumberPlate')).toBeFalse();
    });

    it('should reject invalid format', () => {
      const control = component.addRideForm.get('vehicleNumber');
      control?.setValue('INVALID123');
      expect(control?.hasError('invalidIndianNumberPlate')).toBeTrue();
    });

    it('should reject random string', () => {
      const control = component.addRideForm.get('vehicleNumber');
      control?.setValue('ABC123');
      expect(control?.hasError('invalidIndianNumberPlate')).toBeTrue();
    });
  });

  describe('selectVehicleType()', () => {
    it('should set vehicle type to bike', () => {
      component.selectVehicleType('bike');
      expect(component.addRideForm.get('vehicleType')?.value).toBe('bike');
    });

    it('should set vehicle type to car', () => {
      component.selectVehicleType('car');
      expect(component.addRideForm.get('vehicleType')?.value).toBe('car');
    });

    it('should limit seats to 1 for bike', () => {
      component.selectVehicleType('bike');
      expect(component.maxSeats).toBe(1);
      expect(component.toalSeats).toEqual([1]);
    });

    it('should allow up to 6 seats for car', () => {
      component.selectVehicleType('car');
      expect(component.maxSeats).toBe(6);
      expect(component.toalSeats).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('selectSeats()', () => {
    it('should update available seats value', () => {
      component.selectSeats(4);
      expect(component.addRideForm.get('availableSeats')?.value).toBe(4);
    });
  });

  describe('Event Emitters', () => {
    it('should emit close event when onClose is called', () => {
      spyOn(component.close, 'emit');
      component.onClose();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should emit submit event with form data when form is valid', () => {
      spyOn(component.submit, 'emit');

      // Fill valid form data
      component.addRideForm.patchValue({
        employeeId: 'EMP001',
        vehicleType: 'car',
        vehicleNumber: 'KA01AB1234',
        availableSeats: 3,
        departureTime: '09:00',
        pickupPoint: 'Koramangala',
        destination: 'Whitefield'
      });

      component.onSubmit();

      expect(component.submit.emit).toHaveBeenCalled();
    });
  });

  describe('Pickup Points and Destinations', () => {
    it('should have pickup points defined', () => {
      expect(component.pickupPoints).toBeTruthy();
      expect(component.pickupPoints.length).toBeGreaterThan(0);
    });

    it('should have destinations defined', () => {
      expect(component.destinations).toBeTruthy();
      expect(component.destinations.length).toBeGreaterThan(0);
    });
  });
});
