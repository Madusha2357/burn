import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

@Component({
  selector: 'damen-notification-dialog',
  template: `
    <div style="padding: 10px">
      <img [src]="data.imageUrl" alt="Notification Image" />
      <h2>Patient name: {{ data.name }}</h2>
      <p>Age: {{ data.age }}</p>

      <button (click)="downloadDoc()">Download</button>
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

  downloadDoc(): void {
    const templateFile = 'assets/template.docx';

    fetch(templateFile)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        console.log('Template buffer:', buffer);

        const zip = new PizZip(buffer);
        const doc = new Docxtemplater().loadZip(zip);

        doc.setData({
          name: this.data.name,
          age: this.data.age,
          image: {
            src: this.data.imageUrl,
            width: 200,
            height: 200,
          },
        });

        try {
          doc.render();
          const outputBuffer = doc.getZip().generate({ type: 'blob' });
          console.log('Output buffer:', outputBuffer);

          // Trigger download
          saveAs(outputBuffer, 'patient_notification.docx');
        } catch (error) {
          console.error('Error generating document:', error);
        }
      })
      .catch((error) => {
        console.error('Error loading template file:', error);
      });
  }
}
