import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { Choice } from '@damen/models';
import { filter, Subscription, take, tap } from 'rxjs';
import { uuid } from '../../../../../_utils/uuid';

@Component({
  selector: 'damen-questions-upsert-choice',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './questions-upsert-choice.component.html',
  styleUrls: ['./questions-upsert-choice.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: QuestionsUpsertChoiceComponent,
    },
  ],
})
export class QuestionsUpsertChoiceComponent implements ControlValueAccessor {
  touched = false;
  disabled = false;

  insertFromGroup: FormGroup;

  text = new FormControl();

  displayedColumns = ['text', 'correctAnswer', 'actions'];
  dataSource: Choice[] = [];

  dataMap = new Map<string, Choice>();
  private subscription?: Subscription;

  @ViewChild(MatTable) matTable?: MatTable<Choice>;
  constructor(
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = this.activatedRoute.data
      .pipe(
        take(1),
        tap((data) => {
          console.log(data);
          if (data && data['question']) {
            this.dataSource = data['question'].choices;
            this.onChange(this.dataSource);
          }
        })
      )
      .subscribe();

    this.insertFromGroup = new FormGroup({
      _id: new FormControl(),
      text: this.text,
      correctAnswer: new FormControl(),
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onChange = (quantity: any) => {};

  onTouched = () => {};

  onEdit(event: MouseEvent, templateRef: TemplateRef<any>, data: Choice) {
    this.insertFromGroup.reset(data);
    event.preventDefault();
    const ref = this.matDialog.open(templateRef, { width: '90%', data });
    ref
      .afterClosed()
      .pipe(
        take(1),
        filter((d) => d !== undefined),
        tap((d: Choice) => {
          const id = d._id;
          this.dataMap = this.dataMap.set(id, d);
          this.dataSource = [...this.dataMap.values()];
          this.matTable?.renderRows();
          this.onChange(this.dataSource);
        })
      )
      .subscribe();
  }

  onDelete(event: MouseEvent, templateRef: TemplateRef<any>, data: Choice) {
    event.preventDefault();
    const ref = this.matSnackBar.open('Are you sure want to delete ?', 'Yes', {
      panelClass: 'info',
    });
    ref
      .onAction()
      .pipe(
        take(1),
        tap(() => {
          this.insertFromGroup.reset(data);
          event.preventDefault();
          const id = data._id;
          this.dataMap.delete(id);
          this.dataSource = [...this.dataMap.values()];
          this.matTable?.renderRows();
          this.onChange(this.dataSource);
        })
      )
      .subscribe();
  }

  onAdd(event: MouseEvent, templateRef: TemplateRef<any>) {
    this.insertFromGroup.reset();
    event.preventDefault();
    const ref = this.matDialog.open(templateRef, { width: '90%' });
    ref
      .afterClosed()
      .pipe(
        take(1),
        filter((d) => d !== undefined),
        tap((d: Choice) => {
          const ds = [...this.dataSource];
          const id = uuid(3);
          d._id = id;
          this.dataMap.set(id, d);
          ds.push(d);
          console.log(ds);
          this.dataSource = ds;
          this.matTable?.renderRows();
          this.onChange(ds);
        })
      )
      .subscribe();
  }

  writeValue(choices: Choice[]): void {
    if (choices != null) {
      this.dataSource.concat(choices);
      this.matTable?.renderRows();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
