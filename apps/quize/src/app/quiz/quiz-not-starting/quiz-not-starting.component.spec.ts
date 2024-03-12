import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizNotStartingComponent } from './quiz-not-starting.component';

describe('QuizNotStartingComponent', () => {
  let component: QuizNotStartingComponent;
  let fixture: ComponentFixture<QuizNotStartingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizNotStartingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizNotStartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
