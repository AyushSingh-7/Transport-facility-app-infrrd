import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../core/services/global-service';
import { QuickRideForm, RideItem } from '@shared/models/data-models';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomepageComponent implements OnInit {
  employeeId: string = '';
  current_date: any;
  showQuickRideModal: boolean = false;
  showAddRideModal: boolean = false;
  activeButton: string = 'book_ride';
  availableRidesCount: number = 0;
  quickRideForm: QuickRideForm = {
    from: '',
    to: '',
    time: ''
  };
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  constructor(private router: Router, private globalService: GlobalService) { }

  ngOnInit(): void {
    const formattedDate: string = new Intl.DateTimeFormat('en-GB', this.options).format(new Date());
    this.current_date = formattedDate;
    // Subscribe to rides updates and calculate available rides based on time filter
    this.globalService.rides$.subscribe((rides: RideItem[]) => {
      // Count rides within ±60 minutes of current time
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      this.updateAvaiableRides(rides, currentTime);
    });
    this.globalService.updateAvailableRidesCount$.subscribe((count: number) => {
      this.availableRidesCount = count;//update on filter change
    })
    this.onBookRide();
  }


  updateAvaiableRides(rides: any, currentTime: any): void {
    this.availableRidesCount = rides.filter((ride: any) => {
      const rideTimeMinutes = this.timeStringToMinutes(ride.time);
      const currentTimeMinutes = this.timeStringToMinutes(currentTime);
      const bufferMinutes = 60;

      // Count rides within ±60 minutes of current time
      return rideTimeMinutes >= currentTimeMinutes - bufferMinutes &&
        rideTimeMinutes <= currentTimeMinutes + bufferMinutes;
    }).length;
  }

  private timeStringToMinutes(timeString: string): number {
    // Handle both HH:MM and HH:MM AM/PM formats
    const timeParts = timeString.split(' ')[0].split(':');
    return parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
  }

  onViewRides(): void {
    if (this.employeeId.trim()) {
      console.log('Viewing rides for employee:', this.employeeId);
      // Navigate to book ride with employee ID
      this.router.navigate(['/book_ride'], { queryParams: { empId: this.employeeId } });
    } else {
      alert('Please enter your Employee ID');
    }
  }

  onBookRide(): void {
    this.activeButton = 'book_ride';
    this.router.navigate(['/book-rides']);
  }

  onOfferRide(): void {
    this.activeButton = 'offer';
    this.showAddRideModal = true;
  }

  onMyRides(): void {
    this.activeButton = 'myRides';
    this.router.navigate(['/my-rides']);
  }

  onQuickRide(): void {
    this.showQuickRideModal = true;
  }

  closeQuickRideModal(): void {
    this.showQuickRideModal = false;
    this.resetQuickRideForm();
  }

  closeAddRideModal(): void {
    this.showAddRideModal = false;
  }

  onAddRideSubmit(formData: any): void {
    // Convert departureTime string (HH:MM AM/PM) to time format
    const timeString = formData.departureTime;
    // Create ride object to match RideItem interface
    const newRide = {
      employeeId: formData.employeeId,
      vehicleType: formData.vehicleType as 'bike' | 'car',
      vehicleNo: formData.vehicleNumber,
      vacantSeats: formData.availableSeats,
      time: timeString,
      pickupPoint: formData.pickupPoint,
      destination: formData.destination
    };
    // Add ride using global service
    this.globalService.addRide(newRide);
    console.log('Ride added successfully:', newRide);
    this.closeAddRideModal();
  }

  searchQuickRide(): void {
    if (this.quickRideForm.from.trim() && this.quickRideForm.to.trim()) {
      console.log('Quick ride search:', this.quickRideForm);
      this.router.navigate(['/book_ride']);
      this.closeQuickRideModal();
    } else {
      alert('Please fill in all fields');
    }
  }

  private resetQuickRideForm(): void {
    this.quickRideForm = {
      from: '',
      to: '',
      time: ''
    };
  }
}

