import { Component, EventEmitter, Output } from '@angular/core';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { firstValueFrom } from 'rxjs';
import { AsistenciaService } from '../../../../api';
import { CensoService } from '../../../services/censo.service';
import { PlenoExtraService } from '../../../services/pleno-extra.service';

@Component({
  selector: 'app-informe-asistencia',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './informe-asistencia.component.html',
  styleUrl: './informe-asistencia.component.scss'
})
export class InformeAsistenciaComponent {

  loading: boolean = false;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  asistentesConfirmados: any[] = [];
  asistentesSinConfirmar: any[] = [];
  idPleno: number = -1;
  showConfirmed: boolean = true;

  constructor(
    private plenoExtraService: PlenoExtraService,
    private asistenciaService: AsistenciaService,
    private censoService: CensoService
  ) {}

  ngOnInit() {
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadAsistencia();
    }
  }

  async loadAsistencia() {
    const asistentes = await firstValueFrom(this.asistenciaService.plenosIdPlenoAsistenciaGet(this.idPleno));
    let confirmados: any[] = [];
    let sinConfirmar: any[] = [];
    asistentes.asistencias.map(a => {
      if (a.asistenciaConfirmadaPorSecretaria) {
        confirmados.push(a);
      } else {
        sinConfirmar.push(a);
      }
    })
    for (let asistente of confirmados) {
      this.censoService.asociadosGetById(asistente.idAsociado).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            this.asistentesConfirmados.push(response.asociados[0]);
          }
        }
      });
    }
    for (let asistente of sinConfirmar) {
      this.censoService.asociadosGetById(asistente.idAsociado).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            this.asistentesSinConfirmar.push(response.asociados[0]);
          }
        }
      });
    }
  }

}
