import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'damen-thank-you-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './thank-you-dialog.component.html',
  styleUrls: ['./thank-you-dialog.component.scss'],
})
export class ThankYouDialogComponent {}
