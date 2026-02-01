import { Injectable } from '@angular/core';
import { RideItem, Booking, BookedRideRecord } from '@shared/models/data-models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private readonly RIDES_STORAGE_KEY = 'transport_rides';
  private readonly BOOKINGS_STORAGE_KEY = 'transport_bookings';
  private readonly BOOKED_RIDES_STORAGE_KEY = 'transport_booked_rides';

  // internal store for rides
  private ridesStore: RideItem[] = [];
  private bookingsStore: Booking[] = [];
  private bookedRidesStore: BookedRideRecord[] = [];

  private ridesSubject = new BehaviorSubject<RideItem[]>([...this.ridesStore]);
  private bookingsSubject = new BehaviorSubject<Booking[]>([...this.bookingsStore]);
  private bookedRidesSubject = new BehaviorSubject<BookedRideRecord[]>([...this.bookedRidesStore]);
  private updateAvailableRidesCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadFromLocalStorage();
    // this.clearLocalStorage(); // Uncomment to clear storage during development
    // we can add abutton on home page to clear local storage if needed
  }

  get rides$(): Observable<RideItem[]> {
    return this.ridesSubject.asObservable();
  }

  get bookings$(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  get bookedRides$(): Observable<BookedRideRecord[]> {
    return this.bookedRidesSubject.asObservable();
  }

  get updateAvailableRidesCount$(): Observable<number> {
    return this.updateAvailableRidesCountSubject.asObservable();
  }

  updateAvailableRidesCounts(count: number): void {
    this.updateAvailableRidesCountSubject.next(count);
  }

  addRide(ride: Omit<RideItem, 'id'>): RideItem {
    const newRide: RideItem = {
      id: this._generateId(),
      ...ride
    };
    this.ridesStore = [newRide, ...this.ridesStore];
    this.saveToLocalStorage();
    this.ridesSubject.next([...this.ridesStore]);
    return newRide;
  }

  bookRide(rideId: string, passengerEmployeeId: string, seats: number = 1): Booking | null {
    const rideIndex = this.ridesStore.findIndex(r => r.id === rideId);
    if (rideIndex === -1) return null;

    const ride = this.ridesStore[rideIndex];
    if (ride.vacantSeats < seats) {
      return null;
    }

    // decrement vacant seats
    const updatedRide: RideItem = { ...ride, vacantSeats: ride.vacantSeats - seats };
    this.ridesStore = [
      ...this.ridesStore.slice(0, rideIndex),
      updatedRide,
      ...this.ridesStore.slice(rideIndex + 1)
    ];
    this.saveToLocalStorage();
    this.ridesSubject.next([...this.ridesStore]);

    const booking: Booking = {
      id: this._generateId(),
      rideId: rideId,
      passengerEmployeeId,
      seatsBooked: seats,
      bookedAt: new Date().toISOString()
    };
    this.bookingsStore = [booking, ...this.bookingsStore];
    this.saveToLocalStorage();
    this.bookingsSubject.next([...this.bookingsStore]);

    // Add to booked rides array
    const bookedRideRecord: BookedRideRecord = {
      id: this._generateId(),
      rideId: rideId,
      rideDetails: ride,
      ridePOfferedBy: ride.employeeId,
      bookedBy: passengerEmployeeId,
      seatsBooked: seats,
      bookedAt: new Date().toISOString()
    };
    this.bookedRidesStore = [bookedRideRecord, ...this.bookedRidesStore];
    this.saveToLocalStorage();
    this.bookedRidesSubject.next([...this.bookedRidesStore]);

    return booking;
  }

  getRideById(id: string): RideItem | undefined {
    return this.ridesStore.find(r => r.id === id);
  }

  hasEmployeeAlreadyOfferedRide(employeeId: string): boolean {
    return this.ridesStore.some(r => r.employeeId === employeeId);
  }

  hasEmployeeAlreadyBookedRide(rideId: string, employeeId: string): boolean {
    return this.bookedRidesStore.some(b => b.rideId === rideId && b.bookedBy === employeeId);
  }

  private _generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // LocalStorage management
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.RIDES_STORAGE_KEY, JSON.stringify(this.ridesStore));
      localStorage.setItem(this.BOOKINGS_STORAGE_KEY, JSON.stringify(this.bookingsStore));
      localStorage.setItem(this.BOOKED_RIDES_STORAGE_KEY, JSON.stringify(this.bookedRidesStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const savedRides = localStorage.getItem(this.RIDES_STORAGE_KEY);
      const savedBookings = localStorage.getItem(this.BOOKINGS_STORAGE_KEY);
      const savedBookedRides = localStorage.getItem(this.BOOKED_RIDES_STORAGE_KEY);

      if (savedRides) {
        this.ridesStore = JSON.parse(savedRides);
        this.ridesSubject.next([...this.ridesStore]);
      }

      if (savedBookings) {
        this.bookingsStore = JSON.parse(savedBookings);
        this.bookingsSubject.next([...this.bookingsStore]);
      }

      if (savedBookedRides) {
        this.bookedRidesStore = JSON.parse(savedBookedRides);
        this.bookedRidesSubject.next([...this.bookedRidesStore]);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.ridesStore = [];
      this.bookingsStore = [];
      this.bookedRidesStore = [];
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem(this.RIDES_STORAGE_KEY);
    localStorage.removeItem(this.BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(this.BOOKED_RIDES_STORAGE_KEY);
  }
}
