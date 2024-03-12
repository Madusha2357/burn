import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondImageAndAboutComponent } from './second-image-and-about.component';

describe('SecondImageAndAboutComponent', () => {
  let component: SecondImageAndAboutComponent;
  let fixture: ComponentFixture<SecondImageAndAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondImageAndAboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondImageAndAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
