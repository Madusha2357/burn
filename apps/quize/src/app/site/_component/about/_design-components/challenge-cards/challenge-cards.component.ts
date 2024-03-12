import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'damen-challenge-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenge-cards.component.html',
  styleUrls: ['./challenge-cards.component.scss'],
})
export class ChallengeCardsComponent {
  cardRowOne = [
    {
      number: '1',
      title: 'Study',
      description:
        'Before you start the challenge, take the time to explore and learn the facts, figures and stories behind the SeaXplorer 80 on this platform. Once you feel ready, click the button to start the challenge and the digital trip around the world. Be prepared!',
    },
    {
      number: '2',
      title: 'Join the Challenge on 12 July, 2023',
      description:
        'On the 12th of July, be ready with your desktop and a stable internet connection. The challenge will be accessible for 48-hours from 00:01 CEST on 12 July 2023 until 23:59 CEST on 13 July 2023 and will take approximately 15 minutes of your time.',
    },
    {
      number: '3',
      title: 'Access Your Personal Profile and Log In',
      description:
        'To participate in the SeaXplorer challenge, please log into your personal profile and enter the contest platform. The challenge will take place exclusively on this platform, so make sure to test your log in before the start time to ensure a smooth experience.',
    },
  ];

  cardRowTwo = [
    {
      number: '4',
      title: 'Stay on Track and Finish the Quiz on Time',
      description:
        'During the challenge, our experts such as Rose Damen, Rob Luijendijk, Enrique Tintore and Bill Springer, will guide you through the challenge and present your questions. The challenge is designed to only take approximately 15 minutes of your time.',
    },
    {
      number: '5',
      title: 'And the Winner Is...',
      description:
        'After the exciting digital contest, one lucky winner will be announced in july. Will it be you?',
    },
    {
      number: '6',
      title: 'The World Is Your Oyster',
      description:
        'As the lucky winner of our digital contest, you and your plus one will choose between two incredible destinations for your all-inclusive expedition with EYOS Expeditions. Will it be the stunning Antarctic or breathtaking Papua New Guinea? The choice is yours! Check out our terms and conditions for more information.',
    },
  ];
}
