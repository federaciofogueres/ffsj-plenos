import { Component } from '@angular/core';
import { OrdenDiaComponent } from '../orden-dia/orden-dia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    OrdenDiaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
