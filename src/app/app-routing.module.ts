import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookRidesComponent } from '@components/book-rides/book-rides.component';
import { HomepageComponent } from '@components/homepage/homepage.component';
import { MyRidesComponent } from '@components/my-rides/my-rides.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    children: [
      { path: 'book-rides', component: BookRidesComponent },
      { path: 'my-rides', component: MyRidesComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
