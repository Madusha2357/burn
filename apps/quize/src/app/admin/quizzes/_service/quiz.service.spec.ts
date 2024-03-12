import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuizHttpService } from './quiz.service';

describe('UserService', () => {
  let service: QuizHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    service = TestBed.inject(QuizHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
