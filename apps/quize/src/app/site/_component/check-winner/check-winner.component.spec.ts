import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckWinnerComponent } from './check-winner.component';

describe('CheckWinnerComponent', () => {
  let component: CheckWinnerComponent;
  let fixture: ComponentFixture<CheckWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckWinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
