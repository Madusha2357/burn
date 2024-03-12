import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizUpsertComponent } from './quiz-upsert.component';

describe('QuizUpsertComponent', () => {
  let component: QuizUpsertComponent;
  let fixture: ComponentFixture<QuizUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizUpsertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
