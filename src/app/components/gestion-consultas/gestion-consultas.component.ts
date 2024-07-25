import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, from, switchMap, tap, throwError } from 'rxjs';
import { ConsultasService } from '../../../api';
import { Consulta } from '../../../external-api/consulta';
import { AsistenciaPlenoFormattedModel } from '../../models/asistencia-pleno.model';
import { AsistenciaPlenoService } from '../../services/asistencia-pleno.service';
import { ConsultasInfoService } from '../../services/consultas.service';
import { PlenoExtraService } from '../../services/pleno-extra.service';

@Component({
  selector: 'app-gestion-consultas',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    CommonModule
  ],
  templateUrl: './gestion-consultas.component.html',
  styleUrl: './gestion-consultas.component.scss'
})
export class GestionConsultasComponent {

  loading: boolean = false;
  idPleno: number = -1;

  showUsers: string = 'asistentes';

  asistencias: AsistenciaPlenoFormattedModel[] = [];
  autorizados: AsistenciaPlenoFormattedModel[] = [];

  consultas: Consulta[] = [];
  consultaSeleccionada!: Consulta;

  constructor(
    private asistenciaPlenoService: AsistenciaPlenoService,
    private plenoExtraService: PlenoExtraService,
    private ffsjAlertService: FfsjAlertService,
    private consultasService: ConsultasService,
    private consultasInfoService: ConsultasInfoService
  ){}

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadInfoConsulta();
    }
  }

  loadInfoConsulta() {
    this.loading = true;
    forkJoin([this.loadAsistencia(), this.getConsultas()]).subscribe({
      next: () => {
        if (this.consultaSeleccionada === undefined) {
          this.consultaSeleccionada = this.consultas[0];
        }
        this.loadAutorizados();
      },
      error: (error) => {
        console.log('Error al cargar los datos: ' + error);
        
        this.ffsjAlertService.danger('Error al cargar los datos: ' + error);
        this.loading = false;
      }
    });
  }

  loadAsistencia() {
    return from(this.asistenciaPlenoService.loadAsistencia(this.idPleno)).pipe(
      tap((response: any) => {
        this.asistencias = response;
      }),
      catchError((error) => {
        this.ffsjAlertService.danger('Error al cargar la asistencia: ' + error);
        return throwError(error);
      })
    );
  }
  
  getConsultas() {
    this.consultas = [];
    return this.consultasService.consultasIdGet(this.idPleno).pipe(
      switchMap((response: any) => {
        if (response.status.status === 200) {
          return forkJoin(
            response.consultas.map((consulta: any) =>
              this.consultasInfoService.consultasIdGet(consulta.idConsulta).pipe(
                tap((response: any) => {
                  if (response.status.status === 200) {
                    this.consultas.push(response.consulta);
                  }
                }),
                catchError((error) => {
                  this.ffsjAlertService.danger('Error al cargar las consultas: ' + error);
                  return throwError(error);
                })
              )
            )
          );
        } else {
          return throwError('Error en la respuesta de consultas');
        }
      }),
      catchError((error) => {
        this.ffsjAlertService.danger('Error al cargar las consultas: ' + error);
        return throwError(error);
      })
    );
  }

  changeSelected(event: any) {
    this.loading = true;
    this.consultaSeleccionada = this.consultas.find(consulta => consulta.id === parseInt(event.target.value))!;
    console.log("Elegida -> ", this.consultaSeleccionada);
    
    this.loadInfoConsulta();
  }

  loadAutorizados() {
    this.consultasInfoService.consultasIdConsultaAutorizadosGet(this.consultaSeleccionada.id).subscribe({
      next: (response: any) => {
        console.log(response);
        const autorizadosIds = response.autorizaciones.map((autorizacion: any) => autorizacion.idAsociado);
        this.autorizados = this.asistencias.filter(asistencia => 
          autorizadosIds.includes(asistencia.id)
        );
        this.asistencias = this.asistencias.filter(asistencia => 
          !autorizadosIds.includes(asistencia.id)
        );
        this.loading = false;
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al cargar los autorizados: ' + error);
        this.loading = false;
      }
    });
  }

  autorizar(item: AsistenciaPlenoFormattedModel) {
    let body = {
      idConsulta: this.consultaSeleccionada.id,
      idAsociado: item.id
    }
    this.consultasInfoService.consultasIdConsultaAutorizadosPost(body, this.consultaSeleccionada.id).subscribe({
      next: () => {
        this.autorizados.push(item);
        this.asistencias = this.asistencias.filter(asistencia => asistencia.id !== item.id);
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al confirmar la autorización: ' + error);
      }
    });
  }

  eliminarAutorizacion(item: AsistenciaPlenoFormattedModel) {
    this.consultasInfoService.consultasIdConsultaAutorizadosIdAsociadoDelete(this.consultaSeleccionada.id, item.id).subscribe({
      next: () => {
        this.autorizados = this.autorizados.filter(asistencia => asistencia.id !== item.id);
        this.asistencias.push(item);
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al eliminar la autorización: ' + error);
      }
    });
  }

}
