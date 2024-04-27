import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  Subject,
  catchError,
  map,
  mergeMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  SignIn,
  SignInWithoutNav,
  UpdateQuizId,
} from '../_state/login.actions';
import {
  AddAccessTokenAndNavigate,
  ShowLoading,
} from '../../_state/app.actions';
import { Navigate } from '@ngxs/router-plugin';
import { PATH_SITE, PATH_WINNER } from '../../app-routing.conts';
import { LoginState } from '../_state/login.state';
import { AccessToken } from '@damen/models';

@Component({
  selector: 'damen-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnDestroy {
  signInForm: FormGroup;
  errorEmail?: string;
  errorPassword?: string;
  quizId?: string;
  showPassword = false;
  username: any;

  private notifier$ = new Subject<void>();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    // clear any loading
    this.store.dispatch(new ShowLoading(false));

    this.signInForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });

    this.route.queryParams
      .pipe(
        take(1),
        map((queryParams) => queryParams['quizId'] as string | undefined),
        mergeMap((id) => {
          this.quizId = id;
          if (id) {
            return this.store.dispatch(new UpdateQuizId(id));
          } else {
            return this.store
              .selectOnce(LoginState.quizId)
              .pipe(tap((id) => (this.quizId = id)));
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  /***
   * Dispatch Sign in
   */
  public signIn() {
    if (this.signInForm.valid && this.quizId == undefined) {
      this.signInWithNav();
    } else if (this.quizId) {
      this.signInWithoutNav();
    }
  }

  /***
   * sign in with navigation
   */
  signInWithNav() {
    const user = {
      username: this.signInForm.value['username'].toLowerCase(),
      password: this.signInForm.value['password'],
    };

    this.store
      .dispatch(new SignIn(user))
      .pipe(
        take(1),
        catchError((e: HttpErrorResponse) => {
          this.errorEmail = 'E-mailaddress is unknown.';
          this.errorPassword = 'Password is incorrect.';
          return throwError(() => 'error in sign in component');
        })
      )
      .subscribe();

    return this.httpClient
      .post<AccessToken>('sign-in', user)
      .pipe(
        mergeMap((res) =>
          this.store.dispatch(new AddAccessTokenAndNavigate(res.accessToken))
        )
        // finalize(() => dispatch(new ShowLoading(false)))
      )
      .subscribe();
  }

  /***
   * Sign in without navigation
   */
  signInWithoutNav() {
    this.store
      .dispatch(new SignInWithoutNav(this.signInForm.value))
      .pipe(
        take(1),
        tap(() => {
          this.store.dispatch(new Navigate([`${PATH_SITE}/${PATH_WINNER}`]));
        }),
        catchError((e: HttpErrorResponse) => {
          this.errorEmail = 'E-mailaddress is unknown.';
          this.errorPassword = 'Password is incorrect.';
          return throwError(() => 'error in sign in component');
        })
      )
      .subscribe();
  }

  get f() {
    return this.signInForm.controls;
  }
}
