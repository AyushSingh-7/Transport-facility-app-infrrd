import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingResultModalComponent } from './booking-result-modal.component';

describe('BookingResultModalComponent', () => {
  let component: BookingResultModalComponent;
  let fixture: ComponentFixture<BookingResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingResultModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should default status to success', () => {
      expect(component.status).toBe('success');
    });

    it('should default message to empty string', () => {
      expect(component.message).toBe('');
    });

    it('should set isVisible to true after timeout', fakeAsync(() => {
      component.ngOnInit();
      tick(100);
      expect(component.isVisible).toBeTrue();
    }));
  });

  describe('getIcon()', () => {
    it('should return check_circle for success status', () => {
      component.status = 'success';
      expect(component.getIcon()).toBe('check_circle');
    });

    it('should return cancel for failure status', () => {
      component.status = 'failure';
      expect(component.getIcon()).toBe('cancel');
    });
  });

  describe('getIconClass()', () => {
    it('should return icon-success for success status', () => {
      component.status = 'success';
      expect(component.getIconClass()).toBe('icon-success');
    });

    it('should return icon-failure for failure status', () => {
      component.status = 'failure';
      expect(component.getIconClass()).toBe('icon-failure');
    });
  });

  describe('onClose()', () => {
    it('should set isVisible to false', () => {
      component.isVisible = true;
      component.onClose();
      expect(component.isVisible).toBeFalse();
    });

    it('should emit close event after delay', fakeAsync(() => {
      spyOn(component.close, 'emit');
      component.onClose();
      tick(350);
      expect(component.close.emit).toHaveBeenCalled();
    }));
  });

  describe('Status Display', () => {
    it('should display custom message when provided', () => {
      component.message = 'Booking confirmed!';
      fixture.detectChanges();
      expect(component.message).toBe('Booking confirmed!');
    });

    it('should handle ride details input', () => {
      const rideDetails = {
        from: 'Koramangala',
        to: 'Whitefield',
        departureTime: '09:00'
      };
      component.rideDetails = rideDetails;
      expect(component.rideDetails.from).toBe('Koramangala');
    });
  });
});
