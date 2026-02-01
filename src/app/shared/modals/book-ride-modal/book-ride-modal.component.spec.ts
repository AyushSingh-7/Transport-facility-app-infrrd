import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRideModalComponent } from './book-ride-modal.component';

describe('BookRideModalComponent', () => {
  let component: BookRideModalComponent;
  let fixture: ComponentFixture<BookRideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookRideModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookRideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
