import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../site/_design-components/footer/footer.component';

@Component({
  selector: 'damen-terms-and-condition-new',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './terms-and-condition-new.component.html',
  styleUrls: ['./terms-and-condition-new.component.scss'],
})
export class TermsAndConditionNewComponent {}
