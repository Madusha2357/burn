import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { IMPORTS_STATE } from '../login.module.utils';
import { LoginService } from '../_service/login.service.abstract';
import { LoginMockService } from '../_service/login.service.mock';
import { RegisterCode } from '../_state/register-code/register-code.actions';
import { RegisterCodeComponent } from './register-code.component';

describe('RegisterCodeComponent', () => {
  let component: RegisterCodeComponent;
  let fixture: ComponentFixture<RegisterCodeComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        NgxsModule.forRoot([...IMPORTS_STATE]),
      ],
      providers: [{ provide: LoginService, useValue: new LoginMockService() }],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegisterCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Register Code', () => {
    it('should create the register code component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an otpLength always 6', () => {
      const otpLength = component.otpInputConfig.otpLength;
      expect(otpLength).toEqual(6);
    });

    it('should be an autoFocus always true', () => {
      const autoFocus = component.otpInputConfig.autofocus;
      expect(autoFocus).toEqual(true);
    });

    it('should be an email always undefined', () => {
      const email = component.email;
      expect(email).toEqual(undefined);
    });

    it('should dispatch RegisterCode action for registation code', () => {
      const value = '123456';
      const email = 'user@example.com';

      component.email = email;
      const spyOn = jest.spyOn(store, 'dispatch');
      component.registrationCode(value);
      expect(spyOn).toBeCalledWith(new RegisterCode(value, component.email));
    });
  });
});
