import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstImageAndTextsComponent } from './first-image-and-texts.component';

describe('FirstImageAndTextsComponent', () => {
  let component: FirstImageAndTextsComponent;
  let fixture: ComponentFixture<FirstImageAndTextsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstImageAndTextsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstImageAndTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
