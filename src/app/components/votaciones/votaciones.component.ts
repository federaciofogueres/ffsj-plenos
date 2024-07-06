import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Votacion } from '../../models/votacion.model';

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [],
  templateUrl: './votaciones.component.html',
  styleUrl: './votaciones.component.scss'
})
export class VotacionesComponent {

  votaciones: Votacion[] = [
    {
      id: 1,
      titulo: 'Votación fogueres y barraques ejemplares 2024',
      fecha: '2024-07-30',
      active: true,
      cargo: 'Presidente'
    },
    {
      id: 2,
      titulo: 'Votación cierre de cuentas 2024',
      fecha: '2024-07-30',
      active: false,
      cargo: 'Vicepresidente'
    },
    {
      id: 3,
      titulo: 'Votación imaginaria 2024',
      fecha: '2024-07-30',
      active: true,
      cargo: 'Secretario'
    }
  ];

  constructor(
    private cookieService: CookieService
  ) {}

  goToVotacion(votacion: Votacion) {
    console.log('Ir a votación', votacion);
    // this.cookieService.set('href', 'https://plenos.hogueras.es');
    // this.cookieService.set('href', 'https://polite-pond-09776c203.5.azurestaticapps.net/');
    
    this.cookieService.set('href', 'http://localhost:4201');
    // window.location.href = 'https://consultas.hogueras.es';
    // window.location.href = 'https://gray-forest-0c4b60603.5.azurestaticapps.net/';
    window.location.href = 'http://localhost:4200';
  }

}
