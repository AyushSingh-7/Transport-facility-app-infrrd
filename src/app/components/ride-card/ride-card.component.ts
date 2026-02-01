import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { Ride } from '@shared/models/data-models';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RideCardComponent implements OnInit {
  @Input() ride!: Ride;
  @Input() scheduleTime: string = '';
  @Output() bookRideClicked = new EventEmitter<Ride>();
  totalSeats: Array<number> = []
  constructor() { }

  ngOnInit(): void {
    this.totalSeats = this.ride.vehicleType === 'bike' ? [1] : [1, 2, 3, 4, 5, 6]
  }
  
  onBookRideClick(): void {
    this.bookRideClicked.emit(this.ride);
  }
}

