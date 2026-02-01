import { TestBed } from '@angular/core/testing';
import { GlobalService } from './global-service';

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [GlobalService]
    });
    service = TestBed.inject(GlobalService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty rides array', (done) => {
      service.rides$.subscribe(rides => {
        expect(rides).toEqual([]);
        done();
      });
    });

    it('should initialize with empty bookings array', (done) => {
      service.bookings$.subscribe(bookings => {
        expect(bookings).toEqual([]);
        done();
      });
    });
  });

  describe('addRide()', () => {
    it('should add a new ride and return it with generated id', () => {
      const newRide = {
        employeeId: 'EMP001',
        vehicleType: 'car' as const,
        vehicleNo: 'KA01AB1234',
        vehicleNumber: 'KA01AB1234',
        vacantSeats: 4,
        time: '09:00',
        pickupPoint: 'Koramangala',
        destination: 'Whitefield'
      };

      const result = service.addRide(newRide);

      expect(result).toBeTruthy();
      expect(result.id).toBeTruthy();
      expect(result.employeeId).toBe('EMP001');
      expect(result.vehicleType).toBe('car');
      expect(result.vacantSeats).toBe(4);
    });

    it('should emit updated rides list after adding', (done) => {
      const newRide = {
        employeeId: 'EMP002',
        vehicleType: 'bike' as const,
        vehicleNo: 'KA02CD5678',
        vehicleNumber: 'KA02CD5678',
        vacantSeats: 1,
        time: '10:00',
        pickupPoint: 'Indiranagar',
        destination: 'Electronic City'
      };

      service.addRide(newRide);

      service.rides$.subscribe(rides => {
        expect(rides.length).toBe(1);
        expect(rides[0].employeeId).toBe('EMP002');
        done();
      });
    });

    it('should persist ride to localStorage', () => {
      const newRide = {
        employeeId: 'EMP003',
        vehicleType: 'car' as const,
        vehicleNo: 'KA03EF9012',
        vehicleNumber: 'KA03EF9012',
        vacantSeats: 3,
        time: '11:00',
        pickupPoint: 'HSR Layout',
        destination: 'Marathahalli'
      };

      service.addRide(newRide);

      const stored = localStorage.getItem('transport_rides');
      expect(stored).toBeTruthy();
      const parsedRides = JSON.parse(stored!);
      expect(parsedRides.length).toBe(1);
      expect(parsedRides[0].employeeId).toBe('EMP003');
    });
  });

  describe('bookRide()', () => {
    let rideId: string;

    beforeEach(() => {
      const ride = service.addRide({
        employeeId: 'EMP100',
        vehicleType: 'car' as const,
        vehicleNo: 'KA10XY1234',
        vehicleNumber: 'KA10XY1234',
        vacantSeats: 4,
        time: '14:00',
        pickupPoint: 'JP Nagar',
        destination: 'MG Road'
      });
      rideId = ride.id;
    });

    it('should book a ride and return booking object', () => {
      const booking = service.bookRide(rideId, 'EMP200', 1);

      expect(booking).toBeTruthy();
      expect(booking!.rideId).toBe(rideId);
      expect(booking!.passengerEmployeeId).toBe('EMP200');
      expect(booking!.seatsBooked).toBe(1);
    });

    it('should decrease vacant seats after booking', (done) => {
      service.bookRide(rideId, 'EMP201', 2);

      service.rides$.subscribe(rides => {
        const ride = rides.find(r => r.id === rideId);
        expect(ride?.vacantSeats).toBe(2); // 4 - 2 = 2
        done();
      });
    });

    it('should return null if ride does not exist', () => {
      const booking = service.bookRide('non-existent-id', 'EMP202', 1);
      expect(booking).toBeNull();
    });

    it('should return null if not enough seats available', () => {
      const booking = service.bookRide(rideId, 'EMP203', 10); // Only 4 seats available
      expect(booking).toBeNull();
    });

    it('should add booking to booked rides list', (done) => {
      service.bookRide(rideId, 'EMP204', 1);

      service.bookedRides$.subscribe(bookedRides => {
        expect(bookedRides.length).toBe(1);
        expect(bookedRides[0].bookedBy).toBe('EMP204');
        done();
      });
    });
  });

  describe('getRideById()', () => {
    it('should return ride if exists', () => {
      const added = service.addRide({
        employeeId: 'EMP300',
        vehicleType: 'bike' as const,
        vehicleNo: 'KA30AB1234',
        vehicleNumber: 'KA30AB1234',
        vacantSeats: 1,
        time: '15:00',
        pickupPoint: 'Jayanagar',
        destination: 'Hebbal'
      });

      const found = service.getRideById(added.id);
      expect(found).toBeTruthy();
      expect(found?.employeeId).toBe('EMP300');
    });

    it('should return undefined if ride does not exist', () => {
      const found = service.getRideById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('hasEmployeeAlreadyOfferedRide()', () => {
    it('should return true if employee has already offered a ride', () => {
      service.addRide({
        employeeId: 'EMP400',
        vehicleType: 'car' as const,
        vehicleNo: 'KA40CD5678',
        vehicleNumber: 'KA40CD5678',
        vacantSeats: 3,
        time: '16:00',
        pickupPoint: 'BTM Layout',
        destination: 'Silk Board'
      });

      expect(service.hasEmployeeAlreadyOfferedRide('EMP400')).toBeTrue();
    });

    it('should return false if employee has not offered a ride', () => {
      expect(service.hasEmployeeAlreadyOfferedRide('EMP999')).toBeFalse();
    });
  });

  describe('hasEmployeeAlreadyBookedRide()', () => {
    let rideId: string;

    beforeEach(() => {
      const ride = service.addRide({
        employeeId: 'EMP500',
        vehicleType: 'car' as const,
        vehicleNo: 'KA50EF9012',
        vehicleNumber: 'KA50EF9012',
        vacantSeats: 4,
        time: '17:00',
        pickupPoint: 'Bellandur',
        destination: 'Majestic'
      });
      rideId = ride.id;
    });

    it('should return true if employee has already booked this ride', () => {
      service.bookRide(rideId, 'EMP600', 1);
      expect(service.hasEmployeeAlreadyBookedRide(rideId, 'EMP600')).toBeTrue();
    });

    it('should return false if employee has not booked this ride', () => {
      expect(service.hasEmployeeAlreadyBookedRide(rideId, 'EMP700')).toBeFalse();
    });

    it('should return false for different ride even if employee booked another', () => {
      service.bookRide(rideId, 'EMP800', 1);

      const anotherRide = service.addRide({
        employeeId: 'EMP501',
        vehicleType: 'bike' as const,
        vehicleNo: 'KA51GH3456',
        vehicleNumber: 'KA51GH3456',
        vacantSeats: 1,
        time: '18:00',
        pickupPoint: 'Sarjapur',
        destination: 'Yelahanka'
      });

      expect(service.hasEmployeeAlreadyBookedRide(anotherRide.id, 'EMP800')).toBeFalse();
    });
  });
});
