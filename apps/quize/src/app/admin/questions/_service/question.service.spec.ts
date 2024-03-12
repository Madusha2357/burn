import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionHttpService } from './question.service';

describe('UserService', () => {
  let service: QuestionHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    service = TestBed.inject(QuestionHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
