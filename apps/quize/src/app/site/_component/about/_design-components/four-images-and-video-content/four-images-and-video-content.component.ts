import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'damen-four-images-and-video-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './four-images-and-video-content.component.html',
  styleUrls: ['./four-images-and-video-content.component.scss'],
})
export class FourImagesAndVideoContentComponent {
  @ViewChild('playerContainer', { static: false }) playerContainer!: ElementRef;
}
