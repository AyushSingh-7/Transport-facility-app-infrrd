import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookRidesComponent } from './book-rides.component';
import { GlobalService } from '../../core/services/global-service';
import { BehaviorSubject } from 'rxjs';

describe('BookRidesComponent', () => {
  let component: BookRidesComponent;
  let fixture: ComponentFixture<BookRidesComponent>;
  let ridesSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    ridesSubject = new BehaviorSubject<any[]>([]);

    const globalServiceMock = {
      rides$: ridesSubject.asObservable(),
      bookRide: jasmine.createSpy('bookRide'),
      hasEmployeeAlreadyBookedRide: jasmine.createSpy('hasEmployeeAlreadyBookedRide').and.returnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [BookRidesComponent],
      providers: [{ provide: GlobalService, useValue: globalServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BookRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
