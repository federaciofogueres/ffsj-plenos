import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { ConsultasService } from '../../../api';
import { Consulta } from '../../../external-api/consulta';
import { Votacion } from '../../models/votacion.model';
import { ConsultasInfoService } from '../../services/consultas.service';

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './votaciones.component.html',
  styleUrl: './votaciones.component.scss'
})
export class VotacionesComponent {

  idPleno: number = -1;
  consultas: Consulta[] = [];
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

  loading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private consultasService: ConsultasService,
    private consultaInfoService: ConsultasInfoService,
    private route: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
    if (this.idPleno !== -1) {
      this.getVotaciones();
    } else {
      this.route.navigateByUrl('/plenos');
    }
  }

  getVotaciones() {
    this.consultasService.consultasIdGet(this.idPleno).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          // Convertir cada llamada en una promesa y usar Promise.all para esperar a todas
          Promise.all(response.consultas.map((consulta: any) => {
            return new Promise<void>((resolve, reject) => {
              this.consultaInfoService.consultasIdGet(consulta.idConsulta).subscribe({
                next: (response: any) => {
                  if (response.status.status === 200) {
                    this.consultas.push(response.consulta);
                  }
                  console.log('Consulta:', response);
                  resolve();
                },
                error: (error) => {
                  console.error(error);
                  reject(error);
                }
              });
            });
          })).then(() => {
            // Este código se ejecuta después de que todas las promesas se hayan resuelto
            console.log('ConsultaSSS:', this.consultas);
            this.loading = false;
          }).catch(error => {
            console.error('Error al procesar las consultas:', error);
          });
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  goToVotacion(votacion: Consulta) {
    console.log('Ir a votación', votacion);
    this.cookieService.set('href', 'https://plenos.hogueras.es');
    // this.cookieService.set('href', 'http://localhost:4201');
    
    window.location.href = 'https://consultas.hogueras.es/consultas/' + votacion.id;
    // window.location.href = 'http://localhost:4200';
  }

}
