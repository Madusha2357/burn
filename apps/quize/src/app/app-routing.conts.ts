import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { RouterNavigated } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';

export const PATH_ADMIN = 'admin';

export const PATH_SITE = 'site';
export const PATH_SEAXPLORER = 'seaXplorer';
export const PATH_ABOUT = 'about';

export const PATH_LOGIN = 'login';
export const PATH_SIGNIN = 'sign-in';
export const PATH_REGISTER_CODE = 'register-code';
export const PATH_RESET_PASSWORD = 'reset-password';
export const PATH_USER_REGISTRATION = 'user-registration';
export const PATH_CREATE_PASSOWORD = 'create-password';

export const PATH_COUNTRY_SELECT = 'country-select';

export const PATH_QUIZ = 'quiz';
export const PATH_WELCOME = 'welcome';
export const PATH_QUESTION = 'question';
export const PATH_QUIZ_FORM = 'quiz-form';
export const PATH_WINNER = 'winner';
export const PATH_CHECK_ANSWERS = 'answers';
export const PATH_TNC = 'terms-and-conditions';
export const PATH_QUIZ_NOT_STARTNG = 'quiz-not-starting';
export const PATH_TNCN = 'terms-and-conditions-new';

export const PATH_TNC_FULL = `/${PATH_SITE}/${PATH_TNC}`;

export const PATH_CHALLENGE = 'challenge';

export function updateTitle(notifier$: Subject<void>) {
  const actions$: Actions = inject(Actions);
  const title = inject(Title);
  actions$
    .pipe(
      ofActionSuccessful(RouterNavigated<RouterStateSnapshot>),
      takeUntil(notifier$)
    )
    .pipe(
      tap((action) => {
        const state = action.routerState;
        update(state.url, title);
      })
    )
    .subscribe();
}

function update(url: string, title: Title) {
  switch (url) {
    case `/${PATH_LOGIN}/${PATH_SIGNIN}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_LOGIN}/${PATH_REGISTER_CODE}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_LOGIN}/${PATH_USER_REGISTRATION}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_SITE}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_SITE}/${PATH_SEAXPLORER}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_SITE}/${PATH_ABOUT}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_QUIZ}/${PATH_WELCOME}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_QUIZ}/${PATH_QUESTION}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_QUIZ}/${PATH_QUIZ_FORM}`:
      title.setTitle('Burn Wise Aid');
      break;
    case `/${PATH_CHALLENGE}`:
      title.setTitle('Burn Wise Aid');
      break;
  }
}
