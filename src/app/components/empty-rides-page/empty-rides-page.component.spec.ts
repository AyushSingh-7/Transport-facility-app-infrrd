import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyRidesPageComponent } from './empty-rides-page.component';

describe('EmptyRidesPageComponent', () => {
  let component: EmptyRidesPageComponent;
  let fixture: ComponentFixture<EmptyRidesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyRidesPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyRidesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Template', () => {
    it('should display empty state message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.empty-title');
      expect(title?.textContent).toContain('No rides match');
    });

    it('should display description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.empty-description');
      expect(description?.textContent).toContain('No rides available');
    });
  });
});
