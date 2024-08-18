import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { ConsultasService } from '../../../api';
import { Consulta } from '../../../external-api/consulta';
import { ConsultasInfoService } from '../../services/consultas.service';
import { PlenoExtraService } from '../../services/pleno-extra.service';

@Component({
  selector: 'app-votaciones',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    CommonModule
  ],
  templateUrl: './votaciones.component.html',
  styleUrl: './votaciones.component.scss'
})
export class VotacionesComponent {

  idPleno: number = -1;
  consultas: Consulta[] = [];
  asistencias: number[] = [];

  loading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private consultasService: ConsultasService,
    private consultaInfoService: ConsultasInfoService,
    private plenoExtraService: PlenoExtraService,
    private route: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
    if (this.idPleno !== -1) {
      this.asistencias = this.plenoExtraService.getAsistencias();
      this.getConsultas();
    } else {
      this.route.navigateByUrl('/plenos');
    }
  }

  async checkAutorizado(idConsulta: number, idAsistencia: number): Promise<boolean> {
    try {
        const response: any = await this.consultaInfoService.consultasIdConsultaAutorizadosIdAsistenciaGet(idConsulta, idAsistencia).toPromise();
        console.log(response);
        
        if (response!.status.status === 200 && Array.isArray(response!.autorizaciones)) {
            return response!.autorizaciones.some((auth: any) => auth.idConsulta === idConsulta);
        }
        return false;
    } catch (error) {
        console.error('Error checking authorization:', error);
        return false;
    }
}

  getConsulta(consulta: any, idAsistencia: number) {
    return new Promise<void>(async (resolve, reject) => {
      if (!await this.checkAutorizado(consulta.idConsulta, idAsistencia)) {
        resolve();
        return;
      }
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
  }

  getConsultas() {
    this.consultasService.consultasIdGet(this.idPleno).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          // Convertir cada llamada en una promesa y usar Promise.all para esperar a todas
          Promise.all(response.consultas.map((consulta: any) => {
            this.asistencias.map((idAsistencia: number) => {
              this.getConsulta(consulta, idAsistencia);
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
