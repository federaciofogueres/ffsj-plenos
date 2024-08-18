import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, from, switchMap, tap, throwError } from 'rxjs';
import * as XLSX from 'xlsx';
import { ConsultasService } from '../../../api';
import { Autorizacion } from '../../../external-api/autorizacion';
import { Consulta } from '../../../external-api/consulta';
import { AsistenciaPlenoFormattedModel } from '../../models/asistencia-pleno.model';
import { AsistenciaPlenoService } from '../../services/asistencia-pleno.service';
import { ConsultasInfoService } from '../../services/consultas.service';
import { PlenoExtraService } from '../../services/pleno-extra.service';

export interface FiltroCargo {
  id: number;
  cargo: string;
}

@Component({
  selector: 'app-gestion-consultas',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './gestion-consultas.component.html',
  styleUrl: './gestion-consultas.component.scss'
})
export class GestionConsultasComponent {

  @Output() back: EventEmitter<void> = new EventEmitter<void>();

  filtro: FiltroCargo = {
    id: 1,
    cargo: 'Presidentes de fogueres'
  }

  loading: boolean = false;
  idPleno: number = -1;

  showUsers: string = 'asistentes';

  showItems: AsistenciaPlenoFormattedModel[] = [];

  asistencias: AsistenciaPlenoFormattedModel[] = [];
  autorizados: AsistenciaPlenoFormattedModel[] = [];

  filtrados: AsistenciaPlenoFormattedModel[] = [];

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

  searchAsistente(event: any) {
    const search = event.target.value.toLowerCase();
    let filtrados = this.filterItems(this.filtro);
    this.showItems = filtrados.filter(asistencia => 
      `${asistencia.apellidos} ${asistencia.nombre}`.toLowerCase().includes(search)
    );
   }

  filterItems(filtro: FiltroCargo, items?: AsistenciaPlenoFormattedModel[]) {
    this.filtro = filtro;
    let toFilter = !!items ? [...items] : this.showUsers === 'asistentes' ? [...this.asistencias] : [...this.autorizados];
    return toFilter.filter(asistencia => asistencia.idCargo === this.filtro.id).sort((a, b) => {
      const nameA = `${a.apellidos} ${a.nombre} `.toLowerCase();
      const nameB = `${b.apellidos} ${b.nombre}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
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

  changeShow(event: string) {
    this.showUsers = event;
    this.showItems = this.filterItems(this.filtro);
  }

  loadAutorizados() {
    this.consultasInfoService.consultasIdConsultaAutorizadosGet(this.consultaSeleccionada.id).subscribe({
      next: (response: any) => {
        console.log(response);
        if(Array.isArray(response.autorizaciones)) {
          const autorizadosIds = response.autorizaciones.map((autorizacion: any) => autorizacion.idAsistencia);
          this.autorizados = this.asistencias.filter(asistencia => 
            autorizadosIds.includes(asistencia.idAsistencia)
          )

          this.asistencias = this.asistencias.filter(asistencia => 
            !autorizadosIds.includes(asistencia.idAsistencia)
          )
          this.showItems = this.filterItems(this.filtro);
          console.log(this.asistencias, this.autorizados);
          
        }

        this.loading = false;
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al cargar los autorizados: ' + error);
        this.loading = false;
      }
    });
  }

  autorizar(item: AsistenciaPlenoFormattedModel) {
    let body: Autorizacion = {
      idConsulta: this.consultaSeleccionada.id,
      idAsistencia: item.idAsistencia
    }
    this.consultasInfoService.consultasIdConsultaAutorizadosPost(body, this.consultaSeleccionada.id).subscribe({
      next: () => {
        item.isExpanded = false;
        this.autorizados.push(item);
        this.asistencias = this.asistencias.filter(asistencia => asistencia.idAsistencia !== item.idAsistencia);
        this.showItems = this.filterItems(this.filtro);
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al confirmar la autorización: ' + error);
      }
    });
  }

  eliminarAutorizacion(item: AsistenciaPlenoFormattedModel) {
    this.consultasInfoService.consultasIdConsultaAutorizadosIdAsistenciaDelete(this.consultaSeleccionada.id, item.idAsistencia).subscribe({
      next: () => {
        item.isExpanded = false;
        this.autorizados = this.autorizados.filter(asistencia => asistencia.idAsistencia !== item.idAsistencia);
        this.asistencias.push(item);
        this.showItems = this.filterItems(this.filtro);
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al eliminar la autorización: ' + error);
      }
    });
  }

  handleFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {type: 'binary'});
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      this.processExcelData(data);
    };
    reader.readAsBinaryString(file);
  }
  
  processExcelData(data: any[]) {
    data.forEach((row) => {
      if (row[0]) { 
        const autorizado = this.asistencias.find(asociado => asociado.nif === row[0]);
        if (autorizado) {
          this.autorizar(autorizado);
        }
      }
    });
  }

  // toggleCard(item: any) {
  //   item.isExpanded = !item.isExpanded;
  // }

}
