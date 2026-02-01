import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

export type BookingStatus = 'success' | 'failure';

@Component({
  selector: 'app-booking-result-modal',
  templateUrl: './booking-result-modal.component.html',
  styleUrls: ['./booking-result-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookingResultModalComponent implements OnInit {
  @Input() status: BookingStatus = 'success';
  @Input() message: string = '';
  @Input() rideDetails: any = null;
  @Output() close = new EventEmitter<void>();

  isVisible: boolean = false;

  ngOnInit(): void {
    // Trigger animation after component loads
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }

  onClose(): void {
    this.isVisible = false;
    // Wait for animation to complete before emitting close
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }

  getIcon(): string {
    return this.status === 'success' ? 'check_circle' : 'cancel';
  }

  getIconClass(): string {
    return this.status === 'success' ? 'icon-success' : 'icon-failure';
  }

  getTitle(): string {
    return this.status === 'success' ? 'Booking Successful!' : 'Booking Failed';
  }

  getDefaultMessage(): string {
    if (this.status === 'success') {
      return 'Your ride has been booked successfully. You can view it in your rides.';
    } else {
      return 'Unable to complete your booking. Please try again.';
    }
  }
}
