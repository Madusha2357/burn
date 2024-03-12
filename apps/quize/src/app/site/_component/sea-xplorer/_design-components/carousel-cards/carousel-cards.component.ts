import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'damen-carousel-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel-cards.component.html',
  styleUrls: ['./carousel-cards.component.scss'],
})
export class CarouselCardsComponent {
  cards = [
    {
      image: 'assets/images/site/seaXplorer/image-7.webp',
      location: 'SeaXplorer 60',
      delivery: 'DELIVERY AVAILABLE FROM SPRING 2024',
      href: 'https://www.damenyachting.com/yacht/seaxplorer60/',
      details: [
        '6 guests in 6 spacious cabins',
        'Scuba dive deck',
        'Wet lab for ocean research',
      ],
    },
    {
      image: 'assets/images/site/seaXplorer/image-8.webp',
      location: 'SeaXplorer 77',
      delivery: 'ENQUIRE ABOUT DELIVERY',
      href: 'https://www.damenyachting.com/yacht/seaxplorer-77/',
      details: [
        '6 guests in 6 spacious cabins',
        'Scuba dive deck',
        'Wet lab for ocean research',
      ],
    },
    {
      image: 'assets/images/site/seaXplorer/image-9.webp',
      location: 'SeaXplorer 105',
      delivery: 'ENQUIRE ABOUT DELIVERY',
      href: 'https://www.damenyachting.com/yacht/seaxplorer-105/',
      details: [
        '6 guests in 6 spacious cabins',
        'Scuba dive deck',
        'Wet lab for ocean research',
      ],
    },
  ];
}
