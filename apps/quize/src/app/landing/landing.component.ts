import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'damen-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private http: HttpClient) {
    // this.http
    //   .get<string>('about')
    //   .pipe(tap((d) => console.log('about', d)))
    //   .subscribe();
  }
}
