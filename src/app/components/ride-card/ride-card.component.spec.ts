import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideCardComponent } from './ride-card.component';
import { Ride } from '@shared/models/data-models';

describe('RideCardComponent', () => {
  let component: RideCardComponent;
  let fixture: ComponentFixture<RideCardComponent>;

  const mockRide: Ride = {
    id: 'ride-123',
    rideId: 'ride-123',
    vehicleType: 'car',
    from: 'Koramangala',
    to: 'Whitefield',
    description: 'Daily commute',
    departureTime: '09:00',
    availableSeats: 4,
    offerBy: 'John Doe',
    offerByEmployeeId: 'EMP001',
    vehicleNumber: 'KA01AB1234'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RideCardComponent);
    component = fixture.componentInstance;
    component.ride = mockRide;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have ride input set', () => {
      expect(component.ride).toBeTruthy();
      expect(component.ride.id).toBe('ride-123');
    });

    it('should set totalSeats to 6 for car', () => {
      component.ride = { ...mockRide, vehicleType: 'car' };
      component.ngOnInit();
      expect(component.totalSeats.length).toBe(6);
    });

    it('should set totalSeats to 1 for bike', () => {
      component.ride = { ...mockRide, vehicleType: 'bike' };
      component.ngOnInit();
      expect(component.totalSeats.length).toBe(1);
    });
  });

  describe('onBookRideClick()', () => {
    it('should emit bookRideClicked event with ride data', () => {
      spyOn(component.bookRideClicked, 'emit');

      component.onBookRideClick();

      expect(component.bookRideClicked.emit).toHaveBeenCalledWith(mockRide);
    });
  });

  describe('Ride Display Data', () => {
    it('should display correct pickup and destination', () => {
      expect(component.ride.from).toBe('Koramangala');
      expect(component.ride.to).toBe('Whitefield');
    });

    it('should display correct available seats', () => {
      expect(component.ride.availableSeats).toBe(4);
    });

    it('should display correct departure time', () => {
      expect(component.ride.departureTime).toBe('09:00');
    });

    it('should display correct vehicle number', () => {
      expect(component.ride.vehicleNumber).toBe('KA01AB1234');
    });
  });
});
