import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeQuizComponent } from './finalize-quiz.component';

describe('FinalizeQuizComponent', () => {
  let component: FinalizeQuizComponent;
  let fixture: ComponentFixture<FinalizeQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinalizeQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
