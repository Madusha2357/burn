import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccessToken, Credentials } from '@damen/models';
import { LoginService } from './login.service.abstract';
import { LoginMockService } from './login.service.mock';

describe('UserService', () => {
  let httpTestingController: HttpTestingController;
  let accessToken: AccessToken;
  let credintials: Credentials;
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [{ provide: LoginService, useValue: new LoginMockService() }],
    });

    loginService = TestBed.inject(LoginService);
    httpTestingController = TestBed.inject(HttpTestingController);

    accessToken = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hY2Ftb2RoYUBnbWFpbC5jb20iLCJzdGF0dXMiOiJBY3RpdmUiLCJmaXJzdE5hbWUiOiJDaHVsYW4iLCJsYXN0TmFtZSI6Ik1hZHVyYXBwZXJ1bWEiLCJyb2xlcyI6WyJBRE1JTiIsIlVTRVIiXSwiaWF0IjoxNjcyMDYzMDQxLCJleHAiOjE2NzIwNjM2NDF9.6s56s9hr5uZ18WPa7n0QQCiRLKb2JRxYIMn-LV9aIpc',
    };

    credintials = {
      username: 'user',
      password: 'abc@123',
    };
  });

  it('should be created', () => {
    expect(loginService).toBeTruthy();
  });

  // it('should return an access token', () => {
  //   loginService.login(credintials).subscribe((res) => {
  //     expect(res).toEqual(accessToken);
  //   });
  //   const req = httpTestingController.expectOne(URL_SIGN_IN);
  //   expect(req.request.method).toEqual('POST');
  //   req.flush(accessToken);
  // });
});
