import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFormDialogComponent } from './quiz-form-dialog.component';

describe('QuizFormDialogComponent', () => {
  let component: QuizFormDialogComponent;
  let fixture: ComponentFixture<QuizFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
