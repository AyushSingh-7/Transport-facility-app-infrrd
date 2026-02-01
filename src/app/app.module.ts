import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddRideModalComponent } from './shared/modals/add-ride-modal/add-ride-modal.component';
import { BookRideModalComponent } from './shared/modals/book-ride-modal/book-ride-modal.component';
import { BookingResultModalComponent } from './shared/modals/booking-result-modal/booking-result-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomepageComponent } from '@components/homepage/homepage.component';
import { BookRidesComponent } from '@components/book-rides/book-rides.component';
import { EmptyRidesPageComponent } from '@components/empty-rides-page/empty-rides-page.component';
import { MyRidesComponent } from '@components/my-rides/my-rides.component';
import { RideCardComponent } from '@components/ride-card/ride-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    BookRidesComponent,
    MyRidesComponent,
    RideCardComponent,
    AddRideModalComponent,
    BookRideModalComponent,
    BookingResultModalComponent,
    EmptyRidesPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
