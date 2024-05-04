import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

@Component({
  selector: 'damen-location-dialog',
  template: `
    <div style="padding: 10px">
      <p>Do you want to share your location?</p>
      <div class="row">
        <span class="spacer"></span>
        <button
          class="button"
          style="padding:10px; margin-right: 10px"
          (click)="closeDialog()"
        >
          Close
        </button>
        <button class="button" (click)="ok()">Ok</button>
      </div>
    </div>
  `,
})
export class LocationShareComponent {
  @Output() isOk = new EventEmitter<boolean>();
  store = inject(Store);

  constructor(public dialogRef: MatDialogRef<LocationShareComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
    this.store.dispatch(new Navigate(['landing']));
  }

  ok() {
    this.isOk.emit(true);
    this.dialogRef.close();
  }
}
