import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { GlobalService } from '../../core/services/global-service';
import { take } from 'rxjs/operators';
import { BookedRideRecord, Ride, RideItem } from '@shared/models/data-models';

@Component({
  selector: 'app-my-rides',
  templateUrl: './my-rides.component.html',
  styleUrls: ['./my-rides.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MyRidesComponent implements OnInit {
  employeeId: string = '';
  searchedEmployeeId: string = '';
  myRides: Ride[] = [];
  showNoResults: boolean = false;
  allRidesData: Ride[] = [];

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    // Fetch all rides from global service once
    this.globalService.rides$.pipe(
      // Just take the first value and complete
      take(1)
    ).subscribe((globalRides: RideItem[]) => {
      // Convert RideItem from GlobalService to Ride interface for display
      this.allRidesData = globalRides.map((gride) => ({
        id: gride.id,
        rideId: gride.id,
        vehicleType: gride.vehicleType,
        from: gride.pickupPoint,
        to: gride.destination,
        departureTime: gride.time,
        availableSeats: gride.vacantSeats,
        bookedSeats: 0, // This would be calculated from bookings if needed
        offerBy: gride.employeeId,
        offerByEmployeeId: gride.employeeId,
        type: 'offered' as const,
        status: 'Ride Offered By Me',
        vehicleNumber: gride.vehicleNo
      }));
    });

    // Also fetch booked rides
    this.globalService.bookedRides$.pipe(
      take(1)
    ).subscribe((bookedRides: BookedRideRecord[]) => {
      // Convert booked rides to Ride interface for display
      const convertedBookedRides = bookedRides.map((bookedRide) => ({
        id: bookedRide.id,
        rideId: bookedRide.rideId,
        vehicleType: bookedRide.rideDetails.vehicleType,
        from: bookedRide.rideDetails.pickupPoint,
        to: bookedRide.rideDetails.destination,
        departureTime: bookedRide.rideDetails.time,
        availableSeats: bookedRide.rideDetails.vacantSeats,
        bookedSeats: bookedRide.seatsBooked,
        offerBy: bookedRide.ridePOfferedBy,
        offerByEmployeeId: bookedRide.ridePOfferedBy,
        bookedBy: bookedRide.bookedBy, // Track who booked it
        type: 'booked' as const,
        status: 'Booked By Me'
      }));

      // Combine with existing rides
      this.allRidesData = [...this.allRidesData, ...convertedBookedRides];
    });
  }

  searchByEmployeeId(): void {
    if (!this.employeeId.trim()) {
      this.myRides = [];
      this.showNoResults = false;
      return;
    }

    const searchId = this.employeeId.toUpperCase().trim();
    this.searchedEmployeeId = searchId;

    // Filter rides:
    // - For "Ride Offered By Me": filter by offerByEmployeeId
    // - For "Booked By Me": filter by bookedBy (who booked the ride)
    this.myRides = this.allRidesData.filter(ride => {
      if (ride.status === 'Ride Offered By Me') {
        return ride.offerByEmployeeId === searchId;
      } else if (ride.status === 'Booked By Me') {
        return ride.bookedBy === searchId;
      }
      return false;
    });

    this.showNoResults = this.myRides.length === 0;
  }

  changeEmployeeId(): void {
    this.employeeId = '';
    this.myRides = [];
    this.showNoResults = false;
  }

  getAvailableSeatsCount(ride: Ride): number {
    return ride.availableSeats - (ride.bookedSeats || 0);
  }

  getRideTypeLabel(ride: Ride): string {
    return ride.status || (ride.type === 'offered' ? 'Your Ride' : 'Booked');
  }
}
