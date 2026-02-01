export interface QuickRideForm {
  from: string;
  to: string;
  time: string;
}

export interface Ride {
  id: string;
  rideId: string;
  vehicleType: 'car' | 'bike';
  from: string;
  to: string;
  departureTime: string;
  availableSeats: number;
  bookedSeats?: number;
  offerBy: string;
  offerByEmployeeId: string;
  bookedBy?: string; // Who booked the ride (for booked rides only)
  type?: 'offered' | 'booked';
  status?: string; // 'Ride Offered By Me' | 'Booked By Me'
  vehicleNumber?: string;
  description?: string;
}


export interface RideItem {
  id: string; // unique id
  employeeId: string; // offerer
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string;
  pickupPoint: string;
  destination: string;
  vehicleNumber: string;
}

export interface Booking {
  id: string; // booking id
  rideId: string;
  passengerEmployeeId: string;
  seatsBooked: number;
  bookedAt: string;
}

export interface BookedRideRecord {
  id: string;
  rideId: string;
  rideDetails: RideItem;
  ridePOfferedBy: string; // Who offered the ride
  bookedBy: string; // Who booked the ride
  seatsBooked: number;
  bookedAt: string;
}

export interface RideData {
  id: string;
  rideId: string;
  vehicleType: 'car' | 'bike';
  from: string;
  to: string;
  departureTime: string;
  availableSeats: number;
  offerBy: string;
  vehicleNumber?: string;
}

export interface BookRideFormData {
  employeeId: string;
  seatsToBook: number;
}

export interface BookingResult {
  success: boolean;
  message: string;
  rideDetails?: RideData;
}


export type VehicleType = 'bike' | 'car';
