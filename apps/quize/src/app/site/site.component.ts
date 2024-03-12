import { AfterViewInit, Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

@Component({
  selector: 'damen-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent {
  level: any;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.level = params['level'];
    });
  }
}
