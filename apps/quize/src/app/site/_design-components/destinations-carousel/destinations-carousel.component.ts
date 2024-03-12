import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'damen-destinations-carousel',
  templateUrl: './destinations-carousel.component.html',
  styleUrls: ['./destinations-carousel.component.scss'],
})
export class DestinationsCarouselComponent {
  @ViewChild('slides', { static: true }) slides!: ElementRef;

  cards = [
    {
      image: 'assets/images/site/home/carousel/vlissingen.webp',
      location: 'Vlissingen City',
      details:
        'Vlissingen, the home of Damen Yachting. This beautiful Dutch city is where the Damen Yachting shipyard is located. The city has a rich history and it provides direct deepwater access to the North Sea via the large navy sea lock.',
    },
    {
      image: 'assets/images/site/home/carousel/norway.webp',
      location: 'Norway',
      details: `The breathtaking beauty of Norway's deep blue waters, towering mountain peaks, and magnificent waterfalls is a sight to behold. With the Sognefjord fjord soaring up to 1700 meters above sea level, Norway is a nature lover's paradise.`,
    },
    {
      image: 'assets/images/site/home/carousel/monaco.webp',
      location: 'Monaco',
      details: `Nestled on the French Riviera, Monaco is renowned for its luxurious lifestyle, exclusive events, and picturesque scenery. The world-famous Monte Carlo Casino and Grand Prix circuit are just a few of the many attractions that make Monaco a quintessential destination for the rich and famous.`,
    },
    {
      image: 'assets/images/site/home/carousel/stBarts.webp',
      location: 'St. Barths',
      details: `St. Barths is a beautiful and exclusive Caribbean island known for its white sandy beaches, crystal-clear waters and luxurious lifestyle. It's a popular destination for yacht enthusiasts and the perfect place to unwind and soak up the sun.`,
    },
    {
      image: 'assets/images/site/home/carousel/southPole.webp',
      location: 'Antarctica',
      details: `Embark on an unforgettable adventure as you cruise among icebergs and encounter seals and whales in the stunning, otherworldly environment of Antarctica.`,
    },
    {
      image: 'assets/images/site/home/carousel/seychellen.webp',
      location: 'Madagascar',
      details: `Madagascar is a tropical paradise located in the Indian Ocean and is home to some of the world's best beaches, wildlife, nature and culture. More than 11,000 endemic plant species, including the famous baobab tree, share the island with a vast variety of mammals, reptiles, amphibians, and others.`,
    },
    {
      image: 'assets/images/site/home/carousel/solomonIslands.webp',
      location: 'Solomon Islands',
      details: `Immerse yourself in the fascinating cultures of the Solomon Islands. From ancient ceremonial sites to traditional dances, learn from locals about the customs and traditions that make this destination so unique.`,
    },
    {
      image: 'assets/images/site/home/carousel/kamtsjatka.webp',
      location: 'Kamchatka',
      details: `Kamchatka is a true wilderness destination with stunning landscapes of 300+ volcanoes, hot springs and wildlife. Experience the thrill of many outdoor activities such as heli-skiing, hiking, fishing, and kayaking while surrounded by untouched nature.`,
    },
  ];

  onPrevios() {
    const div = this.slides.nativeElement as HTMLDivElement;
    div.scrollLeft -= div.clientWidth;
  }

  onNext() {
    const div = this.slides.nativeElement as HTMLDivElement;
    div.scrollLeft += div.clientWidth;
  }
}
