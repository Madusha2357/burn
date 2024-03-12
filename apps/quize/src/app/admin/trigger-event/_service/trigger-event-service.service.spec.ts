import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventHttpService } from './trigger-event.service';

describe('UserService', () => {
  let httpTestingController: HttpTestingController;
  let userService: EventHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    userService = TestBed.inject(EventHttpService);
  });

  beforeEach(inject([EventHttpService], (service: EventHttpService) => {
    userService = service;
  }));

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
});
