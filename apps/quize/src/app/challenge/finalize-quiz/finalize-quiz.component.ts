import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  inject,
  isDevMode,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Ng2TelInputModule } from '../../_directives/ng2-tel-input.module';
import { Store } from '@ngxs/store';
import {
  ProjectionUserDataTable,
  URL_USER,
  UpdateUserDto,
} from '@damen/models';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../../_state/app.state';
import Player from '@vimeo/player';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'damen-finalize-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    Ng2TelInputModule,
  ],
  templateUrl: './finalize-quiz.component.html',
  styleUrls: ['./finalize-quiz.component.scss'],
})
export class FinalizeQuizComponent implements AfterViewInit {
  formGroup = new FormGroup({
    phonenumber: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    companyName: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    jobTitle: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    accept: new FormControl<boolean>(false, {
      validators: [Validators.required],
    }),
  });

  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;
  private nativeDiv?: HTMLDivElement;
  private player?: Player;
  private width = 0;
  private height = 0;
  private isMobile = false;

  showVideo = true;
  video = 'https://vimeo.com/823313443/1a498a3b9b';

  matDialog = inject(MatDialog);
  httpClient = inject(HttpClient);

  @ViewChild('wellDone') ref!: TemplateRef<any>;
  @ViewChild('success') success!: TemplateRef<any>;

  id?: string;

  constructor(private store: Store, public mediaMatcher: MediaMatcher) {
    if (isDevMode()) {
      this.formGroup.patchValue({
        phonenumber: '6 12345678',
        companyName: 'OBM',
        jobTitle: 'CTO',
        accept: true,
      });
    }

    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
  }

  ngAfterViewInit(): void {
    this.store
      .selectOnce(AppState.tokenUser)
      .pipe(tap((tokenUser) => (this.id = tokenUser?.id)))
      .subscribe();

    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    this.width = this.nativeDiv.clientWidth;
    this.height = this.nativeDiv.clientHeight;
    this.initQuestion();
  }

  private async initQuestion() {
    if (this.isMobile) {
      this.video = 'https://vimeo.com/823310499/2267cb9245';
    }
    if (this.nativeDiv) {
      this.showVideo = true;
      if (this.player) this.player.destroy();
      this.player = new Player(this.nativeDiv, {
        url: this.video,
        width: this.width,
        height: this.height,
      });

      this.player.play().then(() => {
        console.log('Play started');
      });

      this.player.on('ended', () => {
        this.showVideo = false;
        this.matDialog.open(this.ref, { width: '420px' });
      });
    } else {
      setTimeout(() => {
        this.showVideo = false;
      }, 0);
    }
  }

  onSend() {
    const url = `${URL_USER}/${this.id}`;
    const { phonenumber, companyName, jobTitle, accept } = this.formGroup.value;
    const user: UpdateUserDto = {
      allowMarketingMails: accept as boolean,
      phoneNumber: phonenumber as string,
      company: {
        name: companyName as string,
        title: jobTitle as string,
      },
    };

    this.httpClient
      .patch<ProjectionUserDataTable>(url, user)
      .pipe(tap(() => this.matDialog.open(this.success, { width: '420px' })))
      .subscribe();
  }
}
