import { Component } from '@angular/core';
import { FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { Asistencia, AsistenciaService } from '../../../api';
import { CensoService } from '../../services/censo.service';

export interface AsistenciaModel {
  nombre: string;
  apellidos: string;
  nif: string;
  delegado: boolean;
  confirmadoPorUsuario: boolean;
  confirmadoPorSecretaria: boolean;
  id: number;
}

@Component({
  selector: 'app-gestor-asistencia',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './gestor-asistencia.component.html',
  styleUrl: './gestor-asistencia.component.scss'
})
export class GestorAsistenciaComponent {

  private idPleno = -1;
  protected asistencias: AsistenciaModel[] = [];

  protected loading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private asistenciaService: AsistenciaService,
    private ffsjAlertService: FfsjAlertService,
    private censoService: CensoService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadAsistencia();
    } else {
      this.ffsjAlertService.warning('No se ha seleccionado ningún pleno');
    }
  }

  async loadAsistencia() {
    try {
      const data = await firstValueFrom(this.asistenciaService.plenosIdPlenoAsistenciaGet(this.idPleno));
      if (data.status.status === 200 && data.asistencias.length > 0) {
        const asistenciasPromises = data.asistencias.map(async (asistencia) => {
          const response = await firstValueFrom(this.censoService.asociadosGetById(asistencia.idAsociado));
          if (response && response.status && response.status.status !== 200) {
            throw new Error('Error al cargar la asistencia: ' + response.status.message);
          }
          const asociado = response.asociados && response.asociados[0];
          if (!asociado) {
            throw new Error('Error al cargar la asistencia: No se encontró el asociado');
          }
          return {
            nombre: asociado.nombre,
            apellidos: asociado.apellidos,
            nif: asociado.nif,
            delegado: asistencia.delegado,
            confirmadoPorUsuario: asistencia.asistenciaConfirmada,
            confirmadoPorSecretaria: asistencia.asistenciaConfirmadaPorSecretaria,
            id: asociado.id
          };
        });
        this.asistencias = await Promise.all(asistenciasPromises);
      } else {
        this.ffsjAlertService.warning('No hay asistencias disponibles para este pleno');
      }
    } catch (error) {
      console.error('Error al cargar las asistencias: ', error);
      this.ffsjAlertService.danger('Error al cargar las asistencias: ' + error);
    } finally {
      this.loading = false;
    }
  }

  getIdPleno() {
    this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
  }

  confirmarAsistencia(asistencia: AsistenciaModel) {
    this.asistencias = this.asistencias.map((a) => {
      if (a.nif === asistencia.nif) {
        a.confirmadoPorSecretaria = !a.confirmadoPorSecretaria;
        a.confirmadoPorUsuario = Boolean(a.confirmadoPorUsuario);
      }
      return a;
    });
    let asistenciaBody: Asistencia = {
      idPleno: this.idPleno,
      idAsociado: asistencia.id,
      delegado: Boolean(asistencia.delegado),
      asistenciaConfirmada: asistencia.confirmadoPorUsuario,
      asistenciaConfirmadaPorSecretaria: asistencia.confirmadoPorSecretaria
    }
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoPut(asistenciaBody, this.idPleno, asistenciaBody.idAsociado).subscribe({
      next: (data: any) => {
        console.log(data);
        
        if (data.status.status !== 200) {
          this.ffsjAlertService.danger('Error al confirmar la asistencia: ' + data.status.message);
          this.asistencias = this.asistencias.map((a) => {
            if (a.nif === asistencia.nif) {
              a.confirmadoPorUsuario = !a.confirmadoPorUsuario;
            }
            return a;
          });
        } else {
          this.ffsjAlertService.success('Asistencia confirmada correctamente');
        }

      },
      error: (error) => {
        console.error('Error al confirmar la asistencia: ', error);
        this.ffsjAlertService.danger('Error al confirmar la asistencia: ' + error);
        this.asistencias = this.asistencias.map((a) => {
          if (a.nif === asistencia.nif) {
            a.confirmadoPorUsuario = !a.confirmadoPorUsuario;
          }
          return a;
        });
      }
    })
  }

}
