import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import Player from '@vimeo/player';
import { SiteState } from '../../../../_state/site.state';
import { tap } from 'rxjs';

@Component({
  selector: 'damen-video-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss'],
})
export class VideoDialogComponent {
  @ViewChild('playerContainer', { static: false }) playerContainer?: ElementRef;
  private nativeDiv?: HTMLDivElement;
  private player?: Player;
  private width = 0;
  private height = 0;

  constructor(private store: Store) {}

  private async initQuestion(videoLink: string) {
    console.log('link', videoLink);

    if (this.nativeDiv) {
      if (this.player) this.player.destroy();
      this.player = new Player(this.nativeDiv, {
        url: videoLink,
        width: this.width,
        height: this.height,
      });

      this.player.play().then(() => {
        console.log('Play started');
      });

      this.player.on('ended', () => {
        //this.showVideo = false;
        //this.openDialog();
      });
    } else {
      setTimeout(() => {
        //this.showVideo = false;
      }, 0);
    }
  }

  ngAfterViewInit() {
    this.nativeDiv = this.playerContainer?.nativeElement as HTMLDivElement;
    this.width = this.nativeDiv.clientWidth;
    this.height = this.nativeDiv.clientHeight;

    this.store
      .selectOnce(SiteState.getVideoLink)
      .pipe(tap((link) => this.initQuestion(link ?? '')))
      .subscribe();
  }
}
