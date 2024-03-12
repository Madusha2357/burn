import { MediaMatcher } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountdownTimer,
  QuestionDataTable,
  QuizResponseResult,
} from '@damen/models';
import { Store } from '@ngxs/store';
import Player from '@vimeo/player';
import {
  Observable,
  Subject,
  Subscription,
  interval,
  map,
  mergeMap,
  takeUntil,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { countDownTimerInSeconds } from '../../_utils/count-down';
import { UserGivenAnswer } from '../_state/questions/questions.actions';
import { QuestionState } from '../_state/questions/questions.state';
import { NextQuestion } from '../_state/quiz.actions';
import { QuizState } from '../_state/quiz.state';

@Component({
  selector: 'damen-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss', './questions.animations.scss'],
})
export class QuestionsComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;
  private nativeDiv?: HTMLDivElement;

  showVideo = true;
  image = `url('assets/792a146aaf24045a54daeba6e4bb7f29.png'),url('assets/images/quiz/question-image-2.png')`;

  subscription?: Subscription;
  timeLeft$?: Observable<CountdownTimer>;

  showError?: boolean = false;

  private unsubscriber: Subject<void> = new Subject<void>();
  private startedTime?: number;

  questionFormController: FormControl = new FormControl();
  answerFormController: FormControl = new FormControl();
  question?: QuestionDataTable;

  quiz?: boolean = true;
  private videoPlayer?: Player;
  public width = 0;
  public height = 0;
  private isMobile = false;

  private audioPlayer: HTMLAudioElement;
  private nextNotifier = new Subject<void>();

  constructor(
    private store: Store,
    public mediaMatcher: MediaMatcher,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.questionDisableWhenTimeOut();
    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
    this.audioPlayer = new Audio('assets/mp3/background.mp3');
  }

  ngAfterViewInit() {
    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    const window = this.document.defaultView;
    const screen = window?.screen;
    // this.width = this.nativeDiv.clientWidth;
    // this.height = this.nativeDiv.clientHeight; // screen?.availHeight || 0;
    this.height = screen?.height || 0;
    this.width = screen?.width || 0;
    // console.log(screen?.availHeight, screen?.height);
    this.store
      .select(QuizState.question)
      .pipe(
        takeUntil(this.unsubscriber),
        tap((question) => {
          const image = this.isMobile ? question?.imageMobile : question?.image;
          this.question = question;
          this.image = `url('assets/${image}'),url('assets/images/quiz/question-image-2.png')`;
          this.initQuestion(question);
        })
      )
      .subscribe();
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
    this.startTimer(question?.timerInSeconds);
    this.playBackgroundMusic();
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

  private startTimer(time: number = 60) {
    console.log('Starting timer count down');
    const currentTime = new Date().getTime();
    const now = currentTime + time * 1000;
    this.startedTime = currentTime;
    this.nextNotifier = new Subject();

    this.timeLeft$ = interval(1000).pipe(
      map(() => countDownTimerInSeconds(now)),
      takeUntil(this.nextNotifier),
      takeWhile((timer) => {
        if (timer.secondsToDday === 0) this.next('');
        return timer.secondsToDday > 0;
      })
      // shareReplay(1)
    );
  }

  private stopBackgroundMusic() {
    console.log('Stoping bg music');
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }
  }

  /**
   * go to next questions when time out
   */
  questionDisableWhenTimeOut() {
    this.subscription = this.timeLeft$?.pipe().subscribe();
  }

  //blocking the back, in browser.
  ngOnInit(): void {
    console.log();
    // history.pushState(null, '');
    // fromEvent(window, 'popstate')
    //   .pipe(takeUntil(this.unsubscriber))
    //   .subscribe(() => {
    //     history.pushState(null, '');
    //     this.showError = true;
    //   });
  }

  /**
   *ngOnDestroy for unsubscribe the quiz state
   */
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }
  }

  /**
   *Next question
   */
  next(answer: string) {
    console.log('Next with answer ----- > ', answer);
    this.nextNotifier.next();
    this.nextNotifier.complete();
    const now = new Date().getTime();
    this.stopBackgroundMusic();
    if (this.startedTime && this.question) {
      const duration = Math.abs(now - this.startedTime);
      const { _id, text, displayOrder } = this.question;
      if (_id && text) {
        const userResponse = { questionId: _id, response: [answer], duration };
        this.sendUsersAnswers(userResponse);
        const order: number = displayOrder + 1;
        this.store.dispatch(new NextQuestion(order));
      }
    }
  }

  /**
   *Send users answers
   */
  sendUsersAnswers(response: QuizResponseResult) {
    this.store
      .selectOnce(QuestionState.createdQuizResponseId)
      .pipe(
        mergeMap((id) => {
          if (id && response)
            return this.store.dispatch(new UserGivenAnswer(id, response));
          else
            return throwError(
              () => new Error('Quiz responser id or quiz response is empty!')
            );
        })
      )
      .subscribe();
  }
}
