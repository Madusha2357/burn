import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'damen-logos-and-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logos-and-cards.component.html',
  styleUrls: ['./logos-and-cards.component.scss'],
})
export class LogosAndCardsComponent {
  cards = [
    {
      image: 'assets/images/site/about/image-3.webp',
      title: 'Nansen Explorer',
      location: ' Antartica',
      href: 'https://www.eyos-expeditions.com/destinations/antarctica-south-georgia/',
      description:
        'Originally designed to carry 60 passengers, Nansen Explorer now carries only 12 guests in 7 staterooms. With an Ice-1A classed, 72-meter-long hull and an ice-experienced Captain and bridge team, she can sail further and penetrate deeper into ice than most yachts. An expansive heli-deck complete with onboard refueling capabilities allows exploration inland or heli-skiing. Kayaks, SUPs, and two MK V Zodiacs offer ample opportunities to explore more intimately.',
      details: [
        'The trip will take place in February 2024',
        'One cabin for two people',
      ],
    },
    {
      image: 'assets/images/site/about/image-4.webp',
      title: 'Hanse Explorer',
      location: ' Papua New Guinea',
      href: 'https://www.eyos-expeditions.com/destinations/papua-new-guinea/',
      description:
        'Hanse Explorer is a true expedition yacht in every sense with an ice-classed hull. Hanse Explorer carries two Mark-IV Zodiacs for landing on remote Pacific beaches and newly installed (2020) retractable stabilisers keep her steady at sea. 2021 also brought a multi-million-dollar refit to provide the yacht with a new, contemporary look and Nitrox diving center. Hanse Explorer’s accommodation for 12 adventurous guests is smart and nautical, and a spacious saloon and adjacent dining room feature large windows to bring stunning scenery indoors. An expansive aft deck is used for al fresco dining.',
      details: [
        'The trip will take place during the summer of 2024',
        'Cabin for two people',
      ],
    },
  ];
}
