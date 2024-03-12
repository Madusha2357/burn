import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { QuizResponseResult } from '@damen/models';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { LoginState } from '../../../login/_state/login.state';
import { NavigationBarComponent } from '../../_design-components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'damen-check-answers',
  standalone: true,
  templateUrl: './check-answers.component.html',
  styleUrls: ['./check-answers.component.scss'],
  imports: [CommonModule, NavigationBarComponent],
})
export class CheckAnswersComponent {
  items?: QuizResponseResult[];

  constructor(private store: Store, private _location: Location) {
    store
      .selectOnce(LoginState.questionResponse)
      .pipe(
        tap((res) => {
          this.items = res;
        })
      )
      .subscribe();
  }

  back() {
    this._location.back();
  }
}
