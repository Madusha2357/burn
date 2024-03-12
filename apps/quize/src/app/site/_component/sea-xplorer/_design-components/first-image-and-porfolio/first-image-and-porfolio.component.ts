import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShipDetailsComponent } from "../ship-details/ship-details.component";

@Component({
    selector: 'damen-first-image-and-porfolio',
    standalone: true,
    templateUrl: './first-image-and-porfolio.component.html',
    styleUrls: ['./first-image-and-porfolio.component.scss'],
    imports: [CommonModule, ShipDetailsComponent]
})
export class FirstImageAndPorfolioComponent {}
