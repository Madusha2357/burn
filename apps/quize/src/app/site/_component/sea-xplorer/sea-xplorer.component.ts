import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../_design-components/navigation-bar/navigation-bar.component';
import { FirstImageAndPorfolioComponent } from './_design-components/first-image-and-porfolio/first-image-and-porfolio.component';
import { SecondImageAndDescriptionComponent } from './_design-components/second-image-and-description/second-image-and-description.component';
import { FooterComponent } from '../../_design-components/footer/footer.component';

@Component({
  selector: 'damen-sea-xplorer',
  standalone: true,
  templateUrl: './sea-xplorer.component.html',
  styleUrls: ['./sea-xplorer.component.scss'],
  imports: [
    CommonModule,
    NavigationBarComponent,
    FooterComponent,
    FirstImageAndPorfolioComponent,
    SecondImageAndDescriptionComponent,
  ],
})
export class SeaXplorerComponent {}
