import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserHttpService } from './user.service';

describe('UserService', () => {
  let httpTestingController: HttpTestingController;
  let userService: UserHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    userService = TestBed.inject(UserHttpService);
  });

  beforeEach(inject([UserHttpService], (service: UserHttpService) => {
    userService = service;
  }));

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
});
