import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'damen-notification-dialog',
  template: `
    <div style="padding: 10px">
      <img style="width: 100%" [src]="data.imageUrl" alt="Notification Image" />
      <h2>Patient name: {{ data.name }}</h2>
      <p>Burn level: {{ data.level }}</p>
      <p>Age: {{ data.age }}</p>
      <button class="button" style="padding: 10px" (click)="downloadDoc()">
        Download
      </button>
    </div>
  `,
})
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  downloadDoc() {
    const link = document.createElement('a');
    const content = `
      <h1>Burn details</h1>
      <p>Burn level: ${this.data.level}</p>
      <p>Patient name: ${this.data.name}</p>
      <p>Age: ${this.data.age}</p>
      <img src="${this.data.imageUrl}" alt="Patient Image" style="max-width: 100%;" />
    `;
    const blob = new Blob([content], { type: 'text/html' });
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'patient_info.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('doc downloaded');
  }
}
