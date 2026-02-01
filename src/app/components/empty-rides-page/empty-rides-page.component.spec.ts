import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyRidesPageComponent } from './empty-rides-page.component';

describe('EmptyRidesPageComponent', () => {
  let component: EmptyRidesPageComponent;
  let fixture: ComponentFixture<EmptyRidesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyRidesPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmptyRidesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
