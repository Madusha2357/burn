import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsUpsertChoiceComponent } from './questions-upsert-choice.component';

describe('QuestionsUpsertChoiceComponent', () => {
  let component: QuestionsUpsertChoiceComponent;
  let fixture: ComponentFixture<QuestionsUpsertChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QuestionsUpsertChoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsUpsertChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
