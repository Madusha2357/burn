import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstImageAndPorfolioComponent } from './first-image-and-porfolio.component';

describe('FirstImageAndPorfolioComponent', () => {
  let component: FirstImageAndPorfolioComponent;
  let fixture: ComponentFixture<FirstImageAndPorfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstImageAndPorfolioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstImageAndPorfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
