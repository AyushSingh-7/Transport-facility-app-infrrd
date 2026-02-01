import { Component, ViewEncapsulation, OnInit, EventEmitter, Output } from '@angular/core';
import { GlobalService } from '../../core/services/global-service';
import { QuickRideForm, Ride, RideItem } from '@shared/models/data-models';

@Component({
  selector: 'app-book-rides',
  templateUrl: './book-rides.component.html',
  styleUrls: ['./book-rides.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookRidesComponent implements OnInit {
  selectedVehicleType: string = 'all';
  scheduleTime: string = '';
  minScheduleTime: string = ''; // Minimum allowed time (current time)
  searchQuery: string = '';
  showAddRideModal: boolean = false;
  showQuickRideModal: boolean = false;
  showBookRideModal: boolean = false;
  showBookingResultModal: boolean = false;
  bookingResultStatus: 'success' | 'failure' = 'success';
  bookingResultMessage: string = '';
  bookingResultRideDetails: any = null;
  selectedRideForBooking: Ride | null = null;

  quickRideForm: QuickRideForm = {
    from: '',
    to: '',
    time: ''
  };

  // Sample rides data
  allRides: Ride[] = [];
  filteredRides: Ride[] = [];

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    // Set default schedule time to current time
    this.setDefaultScheduleTime();
    // Subscribe to global service rides and update the list dynamically
    this.globalService.rides$.subscribe((globalRides: RideItem[]) => {
      // Convert RideItem from GlobalService to Ride interface for display
      this.allRides = globalRides.map((gride) => ({
        id: gride.id,
        rideId: gride.id,
        vehicleType: gride.vehicleType,
        from: gride.pickupPoint,
        to: gride.destination,
        description: `${gride.pickupPoint} to ${gride.destination}`,
        departureTime: gride.time,
        availableSeats: gride.vacantSeats,
        offerBy: gride.employeeId,
        offerByEmployeeId: gride.employeeId,
        vehicleNumber: gride.vehicleNo
      }));
      // Apply filters to update filtered rides list
      this.applyFilters();
    });
  }

  setDefaultScheduleTime(): void {
    this.scheduleTime = this.getCurrentTimeString();
    this.minScheduleTime = this.getCurrentTimeString();
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private getCurrentTimeInMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  filterByVehicle(type: string): void {
    this.selectedVehicleType = type;
    this.applyFilters();
  }

  resetTimeFilter(): void {
    this.scheduleTime = '';
    this.applyFilters();
  }

  resetAllFilters(): void {
    this.selectedVehicleType = 'all';
    this.scheduleTime = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRides = this.allRides.filter(ride => {
      // Vehicle type filter
      if (this.selectedVehicleType !== 'all' && ride.vehicleType !== this.selectedVehicleType) {
        return false;
      }
      // Search query filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const matchesSearch =
          ride.from.toLowerCase().includes(query) ||
          ride.to.toLowerCase().includes(query) ||
          ride.rideId.toLowerCase().includes(query) ||
          ride.description?.toLowerCase().includes(query);
        if (!matchesSearch) {
          return false;
        }
      }
      // Time range filter with ±60 min buffer
      if (this.scheduleTime) {
        const rideTime = this.timeStringToMinutes(ride.departureTime);
        const selectedTimeMinutes = this.timeStringToMinutes(this.scheduleTime);
        const bufferMinutes = 60;

        // Check if ride time is within ±60 minutes of selected time
        if (rideTime < selectedTimeMinutes - bufferMinutes || rideTime > selectedTimeMinutes + bufferMinutes) {
          return false;
        }
      } else {
        return;
      }
      return true;
    });
    this.globalService.updateAvailableRidesCounts(this.filteredRides.length);
  }

  openAddRideModal(): void {
    this.showAddRideModal = true;
  }

  closeAddRideModal(): void {
    this.showAddRideModal = false;
  }

  onAddRideSubmit(event: any): void {
    console.log('Add ride submitted:', event);
    this.closeAddRideModal();
  }

  onOfferRide(): void {
    this.showAddRideModal = true;
  }

  openQuickRideModal(): void {
    this.showQuickRideModal = true;
  }

  closeQuickRideModal(): void {
    this.showQuickRideModal = false;
    this.quickRideForm = { from: '', to: '', time: '' };
  }

  searchQuickRide(): void {
    console.log('Quick ride search:', this.quickRideForm);
    this.applyFilters();
    this.closeQuickRideModal();
  }

  bookRide(ride: Ride): void {
    this.selectedRideForBooking = ride;
    this.showBookRideModal = true;
  }

  closeBookRideModal(): void {
    this.showBookRideModal = false;
    this.selectedRideForBooking = null;
  }

  onBookingResult(result: any): void {
    this.bookingResultStatus = result.success ? 'success' : 'failure';
    this.bookingResultMessage = result.message;
    this.bookingResultRideDetails = result.rideDetails || null;
    this.showBookingResultModal = true;
    this.closeBookRideModal();
  }

  closeBookingResultModal(): void {
    this.showBookingResultModal = false;
    this.bookingResultStatus = 'success';
    this.bookingResultMessage = '';
    this.bookingResultRideDetails = null;
  }

  // Helper method to convert time string (HH:MM) to minutes since midnight
  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper method to parse time from ride.departureTime (e.g., "10:30 AM")
  private parseTime(timeStr: string): number {
    const regex = /(\\d{1,2}):(\\d{2})\\s*(AM|PM)?/i;
    const match = timeStr.match(regex);

    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();

    // Convert 12-hour format to 24-hour format
    if (meridiem) {
      if (meridiem === 'PM' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0;
      }
    }

    return hours * 60 + minutes;
  }
}
function output(): (target: BookRidesComponent, propertyKey: "updateAvailableRidesCount") => void {
  throw new Error('Function not implemented.');
}

