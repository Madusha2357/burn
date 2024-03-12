import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../_design-components/navigation-bar/navigation-bar.component';
import { FirstImageAndTextsComponent } from './_design-components/first-image-and-texts/first-image-and-texts.component';
import { LogosAndCardsComponent } from './_design-components/logos-and-cards/logos-and-cards.component';
import { ChallengeCardsComponent } from './_design-components/challenge-cards/challenge-cards.component';
import { FourImagesAndVideoContentComponent } from './_design-components/four-images-and-video-content/four-images-and-video-content.component';
import { ImageWithDescritionComponent } from './_design-components/image-with-descrition/image-with-descrition.component';
import { FooterComponent } from '../../_design-components/footer/footer.component';

@Component({
  selector: 'damen-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    NavigationBarComponent,
    FirstImageAndTextsComponent,
    LogosAndCardsComponent,
    ChallengeCardsComponent,
    FourImagesAndVideoContentComponent,
    ImageWithDescritionComponent,
    FooterComponent,
  ],
})
export class AboutComponent {}
