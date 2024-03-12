import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'damen-into-video',
  templateUrl: 'into-video.component.html',
  styleUrls: ['into-video.component.scss'],
})
export class IntoVideoComponent {
  @ViewChild('playerContainer', { static: false }) playerContainer!: ElementRef;
}
