import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address, UpdateUserDto } from '@damen/models';
import { Store } from '@ngxs/store';
import { UpdateUserAddress } from '../_state/quiz.actions';
import { COUNTRIES } from './quiz-form-country-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuizFormDialogComponent } from './quiz-form-dialog/quiz-form-dialog.component';
import { MediaMatcher } from '@angular/cdk/layout';
import Player from '@vimeo/player';

@Component({
  selector: 'damen-quiz-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss'],
})
export class QuizFormComponent implements AfterViewInit {
  quizForm: FormGroup;
  isPermissionGive?: boolean = false;
  countries = COUNTRIES;
  private isMobile = false;

  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;
  private nativeDiv?: HTMLDivElement;
  private player?: Player;
  private width = 0;
  private height = 0;

  showVideo = true;
  video = 'https://vimeo.com/823313443/1a498a3b9b';

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public mediaMatcher: MediaMatcher
  ) {
    this.quizForm = this.formBuilder.group({
      addressLine: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      allowMarketingMails: [null],
    });

    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
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
        this.openDialog();
      });
    } else {
      setTimeout(() => {
        this.showVideo = false;
      }, 0);
    }
  }

  ngAfterViewInit() {
    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    this.width = this.nativeDiv.clientWidth;
    this.height = this.nativeDiv.clientHeight;

    this.initQuestion();
  }

  openDialog() {
    if (this.isMobile == false) {
      this.dialog.open(QuizFormDialogComponent, { width: '420px' });
    } else {
      this.dialog.open(QuizFormDialogComponent, { width: '100%' });
    }
  }

  send() {
    if (this.quizForm.valid) {
      const address: Address = this.quizForm.value;
      const user: UpdateUserDto = { address: address };
      this.store.dispatch(new UpdateUserAddress(user));
    }
  }

  get f() {
    return this.quizForm.controls;
  }
}
