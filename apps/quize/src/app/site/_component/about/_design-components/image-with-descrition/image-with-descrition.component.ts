import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'damen-image-with-descrition',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-with-descrition.component.html',
  styleUrls: ['./image-with-descrition.component.scss'],
})
export class ImageWithDescritionComponent {}
