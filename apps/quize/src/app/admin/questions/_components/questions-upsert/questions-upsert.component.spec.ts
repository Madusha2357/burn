import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsUpsertComponent } from './questions-upsert.component';

describe('QuestionsUpsertComponent', () => {
  let component: QuestionsUpsertComponent;
  let fixture: ComponentFixture<QuestionsUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QuestionsUpsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
