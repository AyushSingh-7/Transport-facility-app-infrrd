import { Component, EventEmitter, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DESTINATIONS, PICKUP_POINTS } from 'src/app/core/constants/destination';
import { GlobalService } from 'src/app/core/services/global-service';

export interface AddRideFormData {
  employeeId: string;
  vehicleType: 'bike' | 'car' | '';
  vehicleNumber: string;
  availableSeats: number;
  departureTime: string;
  pickupPoint: string;
  destination: string;
}

@Component({
  selector: 'app-add-ride-modal',
  templateUrl: './add-ride-modal.component.html',
  styleUrls: ['./add-ride-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AddRideModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<AddRideFormData>();

  addRideForm!: FormGroup;
  pickupPoints = PICKUP_POINTS;
  destinations = DESTINATIONS;
  maxSeats = 6;
  toalSeats = [1, 2, 3, 4, 5, 6];

  constructor(private formBuilder: FormBuilder, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Custom validator for Indian number plates (including Bharat registration)
  //If I have missed any validtion, please excuse
  private indianNumberPlateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.toUpperCase().replace(/[-\s]/g, '');

    // Pattern 1: Standard format - XX12AB1234 (2 letters + 2 digits + 2 letters + 4 digits)
    const standardPattern = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;

    // Pattern 2: Electric vehicles - XX12EV1234 (2 letters + 2 digits + EV + 4 digits)
    const electricPattern = /^[A-Z]{2}\d{2}EV\d{4}$/;

    // Pattern 3: Temporary registration - XX12TP1234 (Temporary, Diplomat, etc.)
    const temporaryPattern = /^[A-Z]{2}\d{2}(TP|DF|CC|CD)\d{4}$/;

    // Pattern 4: Government vehicles - XX12GV1234
    const governmentPattern = /^[A-Z]{2}\d{2}GV\d{4}$/;

    // Pattern 5: Bharat Registration Mark - YYBHXXXXAB (e.g., 23BH1234AB)
    // YY: Year of registration, BH: Bharat Series, XXXX: 4 digits, AB: 2 letters
    const bharatPattern = /^\d{2}BH\d{4}[A-Z]{2}$/;

    // Pattern 6: Two-wheeler variant - same as standard format
    const twoWheelerPattern = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;

    const isValid =
      standardPattern.test(value) ||
      electricPattern.test(value) ||
      temporaryPattern.test(value) ||
      governmentPattern.test(value) ||
      bharatPattern.test(value) ||
      twoWheelerPattern.test(value);

    return isValid ? null : { invalidIndianNumberPlate: true };
  }

  // Custom validator for duplicate employee rides
  private duplicateEmployeeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const employeeId = control.value.trim();
    if (this.globalService.hasEmployeeAlreadyOfferedRide(employeeId)) {
      return { duplicateEmployee: { value: employeeId } };
    }

    return null;
  }

  private initializeForm(): void {
    this.addRideForm = this.formBuilder.group({
      employeeId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), this.duplicateEmployeeValidator.bind(this)]],
      vehicleType: ['car', Validators.required],
      vehicleNumber: ['', [Validators.required, this.indianNumberPlateValidator.bind(this)]],
      availableSeats: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      departureTime: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 0), Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  selectVehicleType(type: 'bike' | 'car'): void {
    this.addRideForm.get('vehicleType')?.setValue(type);
    // Update max seats based on vehicle type
    if (type === 'bike') {
      this.maxSeats = 1;
      this.toalSeats = [1]
      this.addRideForm.get('availableSeats')?.setValue(1);
    } else if (type === 'car') {
      this.maxSeats = 6;
      this.toalSeats = [1, 2, 3, 4, 5, 6]
      // Keep current value if it's valid, otherwise reset to 1
      const currentSeats = this.addRideForm.get('availableSeats')?.value;
      if (!currentSeats || currentSeats > 6) {
        this.addRideForm.get('availableSeats')?.setValue(1);
      }
    }
  }

  selectSeats(seats: number): void {
    this.addRideForm.get('availableSeats')?.setValue(seats);
  }

  onTimeChange(time: Date): void {
    // Convert date to HH:MM AM/PM format
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const period = time.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours}:${minutes} ${period}`;
    this.addRideForm.get('departureTime')?.setValue(formattedTime);
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.addRideForm.valid) {
      const formData: AddRideFormData = this.addRideForm.getRawValue();
      console.log('Add Ride Form Data:', formData);
      this.submit.emit(formData);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.addRideForm.reset({ availableSeats: 1 });
  }

  // Helper methods for template
  getErrorMessage(fieldName: string): string {
    const control = this.addRideForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      return `${this.getFieldLabel(fieldName)} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    if (control.hasError('duplicateEmployee')) {
      return 'This employee has already offered a ride. An employee can only offer one ride in one day.';
    }
    if (control.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} format is invalid`;
    }
    if (control.hasError('invalidIndianNumberPlate')) {
      return 'Please enter a valid Indian number plate (e.g., MH12AB1234, DL12EV1234, 23BH1234AB)';
    }
    if (control.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['min'].min}`;
    }
    if (control.hasError('max')) {
      return `${this.getFieldLabel(fieldName)} cannot exceed ${control.errors['max'].max}`;
    }
    return 'Invalid input';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      employeeId: 'Employee ID',
      vehicleType: 'Vehicle Type',
      vehicleNumber: 'Vehicle Number',
      availableSeats: 'Available Seats',
      departureTime: 'Departure Time',
      pickupPoint: 'Pick-up Point',
      destination: 'Destination'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.addRideForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
