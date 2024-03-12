import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATH_TNC } from '../../../app-routing.conts';

@Component({
  selector: 'damen-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  tnc = PATH_TNC;
}
