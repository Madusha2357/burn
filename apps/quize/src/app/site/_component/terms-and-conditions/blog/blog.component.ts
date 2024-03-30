/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../_design-components/footer/footer.component';
import { NavigationBarComponent } from '../../../_design-components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'damen-doctors',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavigationBarComponent,
    RouterModule,
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogsComponent implements AfterViewInit {
  blogs?: any[];
  level: any;
  chunkedCards: any;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.blogs = [
      {
        name: 'Blog 1',
      },
      {
        name: 'Blog 2',
      },
      {
        name: 'Blog 3',
      },
    ];

    if (this.blogs) this.chunkedCards = this.chunkArray(this.blogs, 3);
  }

  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }
}
