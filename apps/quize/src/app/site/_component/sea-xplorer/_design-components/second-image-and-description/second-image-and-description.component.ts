import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { Store } from '@ngxs/store';
import { GetVideoLink } from '../../../../_state/site.actions';
import { MediaMatcher } from '@angular/cdk/layout';
import { CarouselCardsComponent } from "../carousel-cards/carousel-cards.component";
import { GreenBackgroundWithImagesComponent } from "../green-background-with-images/green-background-with-images.component";

@Component({
    selector: 'damen-second-image-and-description',
    standalone: true,
    templateUrl: './second-image-and-description.component.html',
    styleUrls: ['./second-image-and-description.component.scss'],
    imports: [CommonModule, MatDialogModule, CarouselCardsComponent, GreenBackgroundWithImagesComponent]
})
export class SecondImageAndDescriptionComponent {
  private isMobile = false;
  videoes = [
    {
      description:
        'Welcome to Monaco. The home of superyachts and the perfect destination to kick off our introduction to the first episode of Xplore.',
      video: 'https://vimeo.com/video/764097283',
    },
    {
      description:
        'In this episode, host Bill Springer travels to Holland to meet with the Damen Yachting team who brought the SeaXplorer concept to life.',
      video: 'https://vimeo.com/video/765604160',
    },
    {
      description:
        'A first in-depth look at two of the SeaXplorer yachts taking shape at our shipyard in Antalya.',
      video: 'https://vimeo.com/video/772087001',
    },
    {
      description:
        'We head to Monaco for the Explorer Yacht Summit where industry elites meet to discuss the latest trends in the explorer yacht market – a field in which Damen Yachting is a key player.',
      video: 'https://vimeo.com/video/773225922',
    },
    {
      description:
        'In this episode we return to Monaco to meet with the exterior design team behind the SeaXplorer concept and we’ll go behind the scenes to find out how they collaborated with real world explorers to perfect this new breed of superyacht.',
      video: 'https://vimeo.com/video/778008645',
    },
    {
      description:
        'In this episode we travel to England to explore two very different interiors designed for two very different SeaXplorers that are currently under construction.',
      video: 'https://vimeo.com/video/779592946',
    },
  ];

  constructor(
    private dialog: MatDialog,
    private store: Store,
    public mediaMatcher: MediaMatcher
  ) {
    this.isMobile = !this.mediaMatcher.matchMedia('(min-width: 768px)').matches;
  }

  openVideo(link: string) {
    this.store.dispatch(new GetVideoLink(link));
    this.dialog.open(VideoDialogComponent, { width: '100%' });
  }
}
