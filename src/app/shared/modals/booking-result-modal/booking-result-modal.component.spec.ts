import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingResultModalComponent } from './booking-result-modal.component';

describe('BookingResultModalComponent', () => {
  let component: BookingResultModalComponent;
  let fixture: ComponentFixture<BookingResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingResultModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookingResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
