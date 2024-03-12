import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSelectDialogComponent } from './quiz-select-dialog.component';

describe('QuizSelectDialogComponent', () => {
  let component: QuizSelectDialogComponent;
  let fixture: ComponentFixture<QuizSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QuizSelectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
