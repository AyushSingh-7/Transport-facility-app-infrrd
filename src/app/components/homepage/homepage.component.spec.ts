import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { GlobalService } from '../../core/services/global-service';
import { BehaviorSubject } from 'rxjs';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let ridesSubject: BehaviorSubject<any[]>;
  let countSubject: BehaviorSubject<number>;
  let router: Router;

  beforeEach(async () => {
    ridesSubject = new BehaviorSubject<any[]>([]);
    countSubject = new BehaviorSubject<number>(0);

    const globalServiceMock = {
      rides$: ridesSubject.asObservable(),
      updateAvailableRidesCount$: countSubject.asObservable(),
      addRide: jasmine.createSpy('addRide')
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [HomepageComponent],
      providers: [{ provide: GlobalService, useValue: globalServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should set current date on init', () => {
      expect(component.current_date).toBeTruthy();
    });

    it('should set default active button to book_ride', () => {
      expect(component.activeButton).toBe('book_ride');
    });

    it('should initialize with 0 available rides', () => {
      expect(component.availableRidesCount).toBe(0);
    });
  });

  describe('Navigation Methods', () => {
    it('should set activeButton to offer when onOfferRide is called', () => {
      component.onOfferRide();
      expect(component.activeButton).toBe('offer');
    });

    it('should show add ride modal when onOfferRide is called', () => {
      component.onOfferRide();
      expect(component.showAddRideModal).toBeTrue();
    });

    it('should set activeButton to myRides when onMyRides is called', () => {
      component.onMyRides();
      expect(component.activeButton).toBe('myRides');
    });
  });

  describe('Modal Controls', () => {
    it('should show quick ride modal when onQuickRide is called', () => {
      component.onQuickRide();
      expect(component.showQuickRideModal).toBeTrue();
    });

    it('should hide quick ride modal and reset form when closeQuickRideModal is called', () => {
      component.showQuickRideModal = true;
      component.quickRideForm = { from: 'A', to: 'B', time: '10:00' };
      component.closeQuickRideModal();
      expect(component.showQuickRideModal).toBeFalse();
      expect(component.quickRideForm.from).toBe('');
    });

    it('should hide add ride modal when closeAddRideModal is called', () => {
      component.showAddRideModal = true;
      component.closeAddRideModal();
      expect(component.showAddRideModal).toBeFalse();
    });
  });

  describe('Available Rides Count', () => {
    it('should update availableRidesCount from updateAvailableRidesCount$ subscription', () => {
      countSubject.next(5);
      expect(component.availableRidesCount).toBe(5);
    });
  });
});
