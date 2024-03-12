import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  isDevMode,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  AccessToken,
  ICreatePublicQuizResponseDto,
  URL_PUBLIC,
  URL_QUIZ_RESPONSE,
} from '@damen/models';
import { Store } from '@ngxs/store';
import { AddAccessToken } from '../../_state/app.actions';
import { tap } from 'rxjs';
import Player from '@vimeo/player';
import { MediaMatcher } from '@angular/cdk/layout';
import { PATH_TNCN } from '../../app-routing.conts';

type InformationFormGroup = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  accept: FormControl<boolean>;
};

@Component({
  selector: 'damen-enter-infomation',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './enter-infomation.component.html',
  styleUrls: ['./enter-infomation.component.scss'],
})
export class EnterInfomationComponent implements AfterViewInit {
  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;

  private nativeDiv?: HTMLDivElement;
  private videoPlayer?: Player;
  private isMobile = false;
  public isCheckboxChecked = false;

  tnc: string = PATH_TNCN;

  public width = 0;
  public height = 0;

  showIntoVideo = false;
  video = 'https://player.vimeo.com/video/358267773?h=8d71fdc199';

  formGroup = new FormGroup<InformationFormGroup>({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    accept: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  router = inject(Router);
  activeRouter = inject(ActivatedRoute);
  httpClient = inject(HttpClient);
  store = inject(Store);
  private mediaMatcher = inject(MediaMatcher);

  constructor() {
    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;

    if (isDevMode()) {
      this.formGroup.patchValue({
        firstName: 'Randika',
        lastName: 'Hapugoda',
        email: 'randika@obm.nl',
        accept: false,
      });
    }
  }

  ngAfterViewInit() {
    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    this.height = screen?.height || 0;
    this.width = screen?.width || 0;
  }

  private async initQuiz(quizId: string, quizResponseId: string) {
    this.showIntoVideo = true;
    if (this.isMobile) {
      this.video = 'https://vimeo.com/823310499/2267cb9245';
    }
    if (this.nativeDiv) {
      if (this.videoPlayer) this.videoPlayer.destroy();
      this.videoPlayer = new Player(this.nativeDiv, {
        url: this.video,
        width: this.width,
        height: this.height,
      });

      this.videoPlayer.play().then(() => {
        console.log('Play started');
      });

      this.videoPlayer.on('ended', () => {
        this.showIntoVideo = false;
        this.router.navigate(['../quize'], {
          relativeTo: this.activeRouter,
          queryParams: { quiz: quizId, quizResponse: quizResponseId },
        });
      });
    } else {
      setTimeout(() => {
        this.showIntoVideo = false;
      }, 0);
    }
  }

  onStart() {
    const url = `${URL_QUIZ_RESPONSE}/${URL_PUBLIC}`;
    const form = this.formGroup.getRawValue();
    const quizId = this.activeRouter.snapshot.queryParams['quiz'];
    const body: ICreatePublicQuizResponseDto = { ...form, quizId };

    this.httpClient
      .post<AccessToken>(url, body)
      .pipe(
        tap((a) => this.store.dispatch(new AddAccessToken(a.accessToken))),
        tap((a) => {
          // if (a.quizResponseId) this.initQuiz(quizId, a.quizResponseId);
          this.router.navigate(['../quize'], {
            relativeTo: this.activeRouter,
            queryParams: { quiz: quizId, quizResponse: a.quizResponseId },
          });
        })
      )
      .subscribe();
  }

  onCheckboxChange() {
    const acceptValue = this.formGroup.value.accept;
    if (typeof acceptValue === 'boolean') {
      this.isCheckboxChecked = acceptValue;
    }
  }
}
