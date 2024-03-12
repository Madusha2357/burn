import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondImageAndDescriptionComponent } from './second-image-and-description.component';

describe('SecondImageAndDescriptionComponent', () => {
  let component: SecondImageAndDescriptionComponent;
  let fixture: ComponentFixture<SecondImageAndDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondImageAndDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondImageAndDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
