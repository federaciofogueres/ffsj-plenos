import { Component } from '@angular/core';
import { OrdenDiaComponent } from '../orden-dia/orden-dia.component';
import { PlenosComponent } from "../plenos/plenos.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    OrdenDiaComponent,
    PlenosComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
