import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import {
  ProjectionQuizDataTable,
  URL_ATTEMP,
  URL_PATH_ACTIVE,
  URL_QUIZ,
  URL_USER,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable, of, tap } from 'rxjs';
import { AppState } from '../../_state/app.state';

@Component({
  selector: 'damen-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  quiz$: Observable<ProjectionQuizDataTable>;
  isUserAttempted$: Observable<boolean> = of(false);

  constructor(private httpClient: HttpClient, private store: Store) {
    const url = `${URL_QUIZ}/${URL_PATH_ACTIVE}`;
    this.quiz$ = this.httpClient.get<ProjectionQuizDataTable>(url);

    // this.store
    //   .selectOnce(AppState.tokenUser)
    //   .pipe(
    //     tap((tokenUser) => {
    //       if (tokenUser) {
    //         const urlAttemp = `${URL_USER}/${URL_ATTEMP}/${tokenUser?.id}`;
    //         // this.isUserAttempted$ = this.httpClient.post<boolean>(
    //         //   urlAttemp,
    //         //   {}
    //         // );
    //       }
    //     })
    //   )
    //   .subscribe();
  }
}
