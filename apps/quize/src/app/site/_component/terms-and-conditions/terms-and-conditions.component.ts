import { Component } from '@angular/core';
import { FooterComponent } from '../../_design-components/footer/footer.component';
import { NavigationBarComponent } from '../../_design-components/navigation-bar/navigation-bar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'damen-terms-and-conditions',
  standalone: true,
  imports: [NavigationBarComponent, FooterComponent, RouterModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent {}
