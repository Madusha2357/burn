import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule, Store } from '@ngxs/store';
import { IMPORTS_STATE } from '../login.module.utils';
import { LoginService } from '../_service/login.service.abstract';
import { LoginMockService } from '../_service/login.service.mock';
import { SignIn } from '../_state/login.actions';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NgxsModule.forRoot([...IMPORTS_STATE])],
      providers: [{ provide: LoginService, useValue: new LoginMockService() }],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Email field', () => {
    it('should be required field : username', () => {
      const email = component.signInForm.controls['username'];
      expect(email.hasError('required')).toBeTruthy();
    });

    it('should have error for invalid username of type email', () => {
      const email = component.signInForm.controls['username'];
      email.setValue('user');
      expect(email.hasError('email')).toBeTruthy();
    });

    it('should not have an error for valid username of type email', () => {
      const email = component.signInForm.controls['username'];
      email.setValue('user@example.com');
      expect(email.hasError('email')).toBeFalsy();
    });
  });

  describe('Password field', () => {
    it('should be required field : password', () => {
      const password = component.signInForm.controls['password'];
      expect(password.hasError('required')).toBeTruthy();
    });
  });

  describe('Form', () => {
    it('should be an invalid form for default values', () => {
      expect(component.signInForm.valid).toBeFalsy();
    });

    it('should be a valid form when it has values', () => {
      component.signInForm.controls['username'].setValue('user@example.com');
      component.signInForm.controls['password'].setValue('password123');
      expect(component.signInForm.valid).toBeTruthy();
    });
  });

  describe('Methods', () => {
    it('should dispatch SingIn action for valid form', () => {
      const payload = {
        username: 'user2@example.com',
        password: 'password123',
      };
      component.signInForm.patchValue(payload);
      const spyOn = jest.spyOn(store, 'dispatch');
      component.signIn();
      expect(spyOn).toBeCalledWith(new SignIn(payload));
    });

    it('should not dispatch an action for invalid form', () => {
      const payload = {
        username: 'user2',
        password: 'password123',
      };
      component.signInForm.patchValue(payload);
      const spyOn = jest.spyOn(store, 'dispatch');
      component.signIn();
      expect(spyOn).toBeCalledTimes(0);
    });
  });
});
