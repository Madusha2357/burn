import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'damen-quiz-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './quiz-form-dialog.component.html',
  styleUrls: ['./quiz-form-dialog.component.scss'],
})
export class QuizFormDialogComponent {}
