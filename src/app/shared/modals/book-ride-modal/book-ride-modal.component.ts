import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/services/global-service';
import { RideData, BookRideFormData, BookingResult } from '@shared/models/data-models';

@Component({
  selector: 'app-book-ride-modal',
  templateUrl: './book-ride-modal.component.html',
  styleUrls: ['./book-ride-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class BookRideModalComponent implements OnInit {
  @Input() ride!: RideData;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<BookRideFormData>();
  @Output() bookingResult = new EventEmitter<BookingResult>();

  bookRideForm!: FormGroup;
  bookingError: string = '';
  totalSeats: Array<number> = []

  constructor(private formBuilder: FormBuilder, private globalService: GlobalService) {   }

  ngOnInit(): void {
    this.totalSeats = this.ride.vehicleType === 'bike' ? [1] : [1, 2, 3, 4, 5, 6]
    this.initializeForm();
  }

  private initializeForm(): void {
    this.bookRideForm = this.formBuilder.group({
      employeeId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onEmployeeIdChange(): void {
    this.bookingError = '';
  }

  onSubmit(): void {
    this.bookingError = '';

    if (!this.bookRideForm.valid) {
      return;
    }

    const employeeId = this.bookRideForm.get('employeeId')?.value?.trim().toUpperCase();

    // Validation checks
    if (employeeId === this.ride.offerBy) {
      this.bookingError = 'Cannot book your own ride';
      return;
    }

    // Check if employee has already booked this ride
    if (this.globalService.hasEmployeeAlreadyBookedRide(this.ride.id, employeeId)) {
      this.bookingError = 'You have already booked this ride';
      return;
    }

    // Book the ride in global service
    const booking = this.globalService.bookRide(this.ride.id, employeeId, 1);

    if (booking) {
      const formData: BookRideFormData = {
        employeeId: employeeId,
        seatsToBook: 1
      };

      const result: BookingResult = {
        success: true,
        message: `Ride booked successfully! Your booking reference is ${booking.id}`,
        rideDetails: this.ride
      };

      this.bookingResult.emit(result);
      this.submit.emit(formData);
      this.resetForm();
    } else {
      const result: BookingResult = {
        success: false,
        message: 'Failed to book ride. No seats available or ride not found.'
      };

      this.bookingResult.emit(result);
      this.bookingError = 'Failed to book ride. Please try again.';
    }
  }

  private resetForm(): void {
    this.bookRideForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookRideForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Employee ID is required';
    }
    if (control.hasError('minlength')) {
      return 'Employee ID must be at least 3 characters';
    }
    if (control.hasError('maxlength')) {
      return 'Employee ID cannot exceed 20 characters';
    }
    return 'Invalid input';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookRideForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
