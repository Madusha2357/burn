import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  QuestionDataTable,
  QuizResponseResult,
  URL_PATH_APPEND,
  URL_PATH_QUESTION_BY_QUIZ_ID,
  URL_QUESTION,
  URL_QUIZ_RESPONSE,
} from '@damen/models';
// import * as Player from '@vimeo/player';
import Player from '@vimeo/player';
import { Subject, catchError, mergeMap, take, tap, throwError } from 'rxjs';
import {
  snackBarError,
  snackBarErrorThrow,
} from '../../_utils/snack-bar.utils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'damen-quize',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './quize.component.html',
  styleUrls: ['./quize.component.scss', './quize.animations.scss'],
})
export class QuizeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;
  private nativeDiv?: HTMLDivElement;

  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  private mediaMatcher = inject(MediaMatcher);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);

  private quizId = '';
  private quizResponse = '';
  private order = 1;

  private isMobile = false;
  private startedTime?: number;
  private videoPlayer?: Player;
  private audioPlayer: HTMLAudioElement;

  public showVideo = true;
  public width = 0;
  public height = 0;

  public image = `url('assets/792a146aaf24045a54daeba6e4bb7f29.png'),url('assets/images/quiz/question-image-2.png')`;
  public question?: QuestionDataTable;
  public textCtrl = new FormControl();
  private notifier$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.quizId = queryParams['quiz'];
    this.quizResponse = queryParams['quizResponse'];
    this.order = queryParams['order'] || 1;
    this.audioPlayer = new Audio('assets/mp3/background.mp3');
  }

  ngOnInit(): void {
    // this.activatedRoute.queryParamMap
    //   .pipe(takeUntil(this.notifier$))
    //   .subscribe();
    this.getQuestion(this.order).pipe(take(1)).subscribe();
    // console.log();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }

  ngAfterViewInit() {
    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    const window = this.document.defaultView;
    const screen = window?.screen;
    this.height = screen?.height || 0;
    this.width = screen?.width || 0;
  }

  getQuestion(order: number) {
    let params = new HttpParams();
    params = params.append('displayOrder', `${order}`);
    const url = `${URL_QUESTION}/${URL_PATH_QUESTION_BY_QUIZ_ID}/${this.quizId}`;
    this.textCtrl.reset();
    return this.httpClient.get<QuestionDataTable>(url, { params }).pipe(
      tap((question) => {
        console.log('GOT Q from REST', question._id);
        const image = this.isMobile ? question?.imageMobile : question?.image;
        this.question = question;
        this.image = `url('assets/${image}'),url('assets/images/quiz/question-image-2.png')`;
        this.initQuestion(question);
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { order },
          queryParamsHandling: 'merge',
        });
      })
    );
  }

  private async initQuestion(question?: QuestionDataTable) {
    console.log('Initializting Question ', question?._id);
    let video = question?.videoUrl;
    if (this.isMobile && question?.videoUrlMobile !== '') {
      video = question?.videoUrlMobile;
    }

    const start =
      video?.startsWith('https://vimeo.com') ||
      video?.startsWith('https://player.vimeo.com/video');

    if (start && this.nativeDiv) {
      this.showVideo = true;
      if (this.videoPlayer) {
        this.videoPlayer.destroy();
        console.log('Removing old video player');
      }

      let height = this.height;
      let width = this.width;

      if (this.isMobile) {
        const heighDif = (this.height - 426) / 2;
        const widthDif = (this.width - 240) / 2;

        width = 260 + widthDif;
        height = 426 + heighDif;
      }

      this.videoPlayer = new Player(this.nativeDiv, {
        url: video,
        width,
        height,
        controls: true,
        autoplay: true,
      });

      this.videoPlayer.ready().catch((e) => {
        console.log('Video is ready');
        this.showVideo = false;
      });

      this.videoPlayer.play();

      this.videoPlayer.on('ended', () => {
        console.log('Video endedd');
        this.showQuestion(question);
      });
    } else {
      console.log('Video not found');
      setTimeout(() => this.showQuestion(question), 0);
    }
  }

  private showQuestion(question?: QuestionDataTable) {
    console.log(
      `Strting to show quiestion.Anser in ${question?.timerInSeconds}`
    );
    // this.playBackgroundMusic();
    this.startedTime = new Date().getTime();
    this.showVideo = false;
  }

  private playBackgroundMusic() {
    console.log('Playing bg music');
    try {
      this.audioPlayer.play();
    } catch (error) {
      console.log('Error playing audio');
    }
  }

  /**
   *Next question
   */
  next(answer: string) {
    console.log('Next with answer ----- > ', answer);
    const now = new Date().getTime();
    this.stopBackgroundMusic();
    if (this.startedTime && this.question) {
      const duration = Math.abs(now - this.startedTime);
      const { _id, displayOrder } = this.question;
      const userResponse = { questionId: _id, response: [answer], duration };
      this.sendUsersAnswers(userResponse)
        .pipe(
          // mergeMap(() => {
          //   const order: number = displayOrder + 1;
          //   return this.getQuestion(order);
          // }),
          catchError((res: HttpErrorResponse) => {
            if (res.status === 404) {
              this.router.navigate(['../finalize-quiz'], {
                relativeTo: this.activatedRoute,
              });
            }
            return throwError(() => res);
          })
        )
        .subscribe();
    }
  }

  private stopBackgroundMusic() {
    console.log('Stoping bg music');
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }
  }

  /**
   *Send users answers
   */
  sendUsersAnswers(response: QuizResponseResult) {
    const url = `${URL_QUIZ_RESPONSE}/${URL_PATH_APPEND}/${this.quizResponse}`;
    return this.httpClient.patch<string>(url, response).pipe(
      catchError((res: HttpErrorResponse) => {
        if (res.status === 400 && this.question) {
          const { displayOrder } = this.question;
          snackBarError(res.error.message, this.matSnackBar);
          return this.getQuestion(displayOrder + 1);
        }
        return snackBarErrorThrow(res.error, this.matSnackBar);
      })
    );
  }
}
