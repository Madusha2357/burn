import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { USER_ERROR_PAYLOARD, USER_PAYLOARD } from '@damen/stubs';
import { NgxsModule, Store } from '@ngxs/store';
import { IMPORTS_STATE } from '../login.module.utils';
import { LoginService } from '../_service/login.service.abstract';
import { LoginMockService } from '../_service/login.service.mock';
import { UserRegistration } from '../_state/user-registration/user-registration.actions';
import { UserUpdateComponent } from './user-update.component';

describe('UserRegistrationComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NgxsModule.forRoot([...IMPORTS_STATE])],
      providers: [{ provide: LoginService, useValue: new LoginMockService() }],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('User registration component', () => {
    it('should create user registration component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('User registration variables', () => {
    it('should be checkbox value: false', () => {
      const checkboxValue = component.saveUsername?.valueOf();
      expect(checkboxValue).toBe(false);
    });
  });

  describe('first name field', () => {
    it('should be required field : firstName', () => {
      const firstName = component.registerForm.controls['firstName'];
      expect(firstName.hasError('required')).toBeTruthy();
    });

    it('should not have an error for valid firstName of type name', () => {
      const firstName = component.registerForm.controls['firstName'];
      firstName.setValue('user');
      expect(firstName.hasError('name')).toBeFalsy();
    });
  });

  describe('last name field', () => {
    it('should be required field : lastName', () => {
      const lastName = component.registerForm.controls['lastName'];
      expect(lastName.hasError('required')).toBeTruthy();
    });

    it('should not have an error for valid lastName of type name', () => {
      const lastName = component.registerForm.controls['firstName'];
      lastName.setValue('user');
      expect(lastName.hasError('name')).toBeFalsy();
    });
  });

  describe('Password field', () => {
    it('should be required field : password', () => {
      const password = component.registerForm.controls['password'];
      expect(password.hasError('required')).toBeTruthy();
    });
  });

  describe('Form', () => {
    it('should be an invalid form for default values', () => {
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should be a valid form when it has values', () => {
      component.registerForm.controls['firstName'].setValue('user1');
      component.registerForm.controls['lastName'].setValue('user2');
      component.registerForm.controls['password'].setValue('password123');
      component.registerForm.controls['confirmPassword'].setValue(
        'password123'
      );
      expect(component.registerForm.valid).toBeTruthy();
    });
  });

  describe('Methods', () => {
    it('should dispatch UserRegistration action for valid form', () => {
      component.registerForm.controls['firstName'].setValue('user1');
      component.registerForm.controls['lastName'].setValue('user2');
      component.registerForm.controls['password'].setValue('password123');
      component.registerForm.controls['confirmPassword'].setValue(
        'password123'
      );
      component.registerForm.patchValue(USER_PAYLOARD);
      const spyOn = jest.spyOn(store, 'dispatch');
      component.userRegistration();
      expect(spyOn).toBeCalledWith(new UserRegistration(USER_PAYLOARD));
    });

    it('should not dispatch an action for invalid form', () => {
      component.registerForm.patchValue(USER_ERROR_PAYLOARD);
      const spyOn = jest.spyOn(store, 'dispatch');
      component.userRegistration();
      expect(spyOn).toBeCalledTimes(0);
    });
  });
});
