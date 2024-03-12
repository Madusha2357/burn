import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { QuizUpsertComponent } from './_components/quiz-upsert/quiz-upsert.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

export const IMPORTS = [
  MatSnackBarModule,
  MatPaginatorModule,
  MatButtonModule,
  MatIconModule,
  MatButtonModule,
  MatTableModule,
  MatIconModule,
  MatToolbarModule,
  MatDialogModule,
  MatSortModule,
  QuizUpsertComponent,
  MatInputModule,
  MatFormFieldModule,
  ReactiveFormsModule,
];
