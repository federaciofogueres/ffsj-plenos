import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EncoderService, FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { Asistencia, AsistenciaService, ConsultasService } from '../../../api';
import { Consulta } from '../../../external-api/consulta';
import { AsistenciaPlenoFormattedModel } from '../../models/asistencia-pleno.model';
import { AsistenciaPlenoService } from '../../services/asistencia-pleno.service';
import { CensoService } from '../../services/censo.service';
import { ConsultasPlenoService } from '../../services/consultas-pleno.service';
import { ConsultasInfoService } from '../../services/consultas.service';
import { PlenoExtraService } from '../../services/pleno-extra.service';
import { ConsultasDialogComponent } from '../dialogs/consultas-dialog/consultas-dialog.component';

export interface FiltroCargo {
  id: number;
  cargo: string;
}
@Component({
  selector: 'app-gestor-asistencia',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    CommonModule,
    ZXingScannerModule
  ],
  templateUrl: './gestor-asistencia.component.html',
  styleUrl: './gestor-asistencia.component.scss'
})
export class GestorAsistenciaComponent {

  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  scanQRMode: boolean = false;
  qrResultString: string = '';
  qrResultStringDecoded: string = '';
  fromQr: boolean = true;

  private idPleno = -1;
  private asistencias: AsistenciaPlenoFormattedModel[] = [];
  protected showItems: AsistenciaPlenoFormattedModel[] = [];

  filtro: FiltroCargo = {
    id: -1,
    cargo: 'Todos'
  }

  protected loading: boolean = false;

  consultasPlenos: Consulta[] = [];

  constructor(
    private cookieService: CookieService,
    private asistenciaService: AsistenciaService,
    private ffsjAlertService: FfsjAlertService,
    private censoService: CensoService,
    private asistenciaPlenoService: AsistenciaPlenoService,
    private plenoExtraService: PlenoExtraService,
    private encoderService: EncoderService,
    private router: Router,
    private dialog: MatDialog,
    private consultasService: ConsultasService,
    private consultasInfoService: ConsultasInfoService,
    private consultasPlenoService: ConsultasPlenoService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadAsistencia();
      this.loadConsultas();
    } else {
      this.ffsjAlertService.warning('No se ha seleccionado ningún pleno');
    }
  }

  searchAsistente(event: any) {
    const search = event.target.value.toLowerCase();
    let filtrados = this.filterItems();
    this.showItems = filtrados.filter(asistencia => 
      `${asistencia.apellidos} ${asistencia.nombre}`.toLowerCase().includes(search)
    );
  }

  filterByCargo(filtro: FiltroCargo) {
    this.filtro = filtro;
    this.showItems = this.filterItems();
  }

  filterItems(items?: AsistenciaPlenoFormattedModel[]) {
    let toFilter = !!items ? [...items] : [...this.asistencias];
    let itemsFiltered = this.filtro.id === -1 ? toFilter : toFilter.filter(asistencia => asistencia.idCargo === this.filtro.id);
    return itemsFiltered.sort((a, b) => {
      const nameA = `${a.apellidos} ${a.nombre} `.toLowerCase();
      const nameB = `${b.apellidos} ${b.nombre}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  loadConsultas() {
    this.consultasPlenoService.getConsultasFromPlenoAsync(this.idPleno!)
    .then((consultas: any) => {
      this.consultasPlenos = consultas;
    })
    .catch(error => console.error('Error in getConsultasFromPlenoAsync:', error))
  }

  async loadAsistencia() {
    this.loading = true;
    this.asistenciaPlenoService.loadAsistencia(this.idPleno).then((asistencias: any) => {
      this.asistencias = this.filterItems(asistencias);
      this.showItems = [...this.asistencias];
    }).catch((error) => {
      this.ffsjAlertService.danger('Error al cargar las asistencias: ' + error);
    }).finally(() => {
      this.loading = false;
    });
  }

  async manageConsultas(asistencia: AsistenciaPlenoFormattedModel): Promise<void> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(ConsultasDialogComponent, {
        data: { consultas: this.consultasPlenos, asistencia: asistencia },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe((result: any) => {

        if (!!result && Array.isArray(result)) {
          const requests = result.map((consulta) => {
            return this.consultasInfoService.consultasIdConsultaAutorizadosPost({idConsulta: consulta.id, idAsistencia: asistencia.idAsistencia}, consulta.id).toPromise();
          });

          Promise.all(requests).then((responses: any) => {
            responses.forEach((data: any) => {
              if (data.status.status !== 200) {
                this.ffsjAlertService.danger('Error al autorizar al asociado: ' + data.status.message);
              } else {
                this.ffsjAlertService.success('Usuario autorizado correctamente');
              }
            });
            this.loading = false;
            resolve();
          }).catch((error) => {
            console.error('Error al autorizar al asociado: ', error);
            this.ffsjAlertService.danger('Error al autorizar al asociado: ' + error.error);
            this.loading = false;
            reject();
          });
        } else {
          this.ffsjAlertService.danger('Error al autorizar al asociado: el objeto resultado es ' + result);
          reject();
        }

      });
    });
  }

  confirmarAsistencia(asistencia: AsistenciaPlenoFormattedModel) {
    let asistenciaBody: Asistencia = {
      idPleno: this.idPleno,
      idAsociado: asistencia.idAsociado,
      delegado: Boolean(asistencia.delegado),
      asistenciaConfirmada: true,
      asistenciaConfirmadaPorSecretaria: !Boolean(asistencia.confirmadoPorSecretaria),
      idAsistencia: asistencia.idAsistencia,
      idAsociacion: asistencia.idAsociacion,
      idCargo: asistencia.idCargo
    }
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoPut(asistenciaBody, this.idPleno, asistenciaBody.idAsociado).subscribe({
      next: (data: any) => {
        if (data.status.status !== 200) {
          this.ffsjAlertService.danger('Error al confirmar la asistencia: ' + data.status.message);
        } else {
          this.asistencias = this.asistencias.map((a) => {
            if (a.idAsistencia === asistencia.idAsistencia) {
              a.confirmadoPorSecretaria = !a.confirmadoPorSecretaria;
              a.confirmadoPorUsuario = Boolean(a.confirmadoPorUsuario);
            }
            return a;
          });
          this.showItems = this.filterItems();
          this.ffsjAlertService.success('Asistencia confirmada correctamente');
        }
      },
      error: (error) => {
        this.ffsjAlertService.danger('Error al confirmar la asistencia: ' + error);
      }
    })
  }

  onCodeResult(resultString: string) {
    this.loading = true;
    this.scanQRMode = false;
    this.qrResultString = resultString;
    // this.qrResultString = "U2FsdGVkX185DzySvYSSgWQy5w08pK2761s3JnDOmu/CLbDYbrWRs/RkscX/k6jQHVT8UQx7ft+oV+aX8QoM14DutZioD5Z/f6gv/zdo2tEIiiGThhBLtBLasegOwh3PRhdA+gmXTo8IqBfkpeQ32OBKfBHcE5403y1kGp7IpOeJV1wFXF3UiSaTNuwVAm855+MvA9RptfS7UkPctqY6l3WgWSsG6g7XR6aiutb0PW8MEZ59oCR9zRhWjIVjIdkC";

    console.log('QR code scanned:', resultString);
    this.qrResultStringDecoded = this.encoderService.decrypt(this.qrResultString);
    let asistenciaQR: Asistencia = JSON.parse(this.qrResultStringDecoded);
    if (asistenciaQR.idPleno !== this.idPleno) {
      this.ffsjAlertService.danger('El QR no pertenece a este pleno');
      this.loading = false;
      return;
    }
    const bodyAsistencia: AsistenciaPlenoFormattedModel[] | undefined = this.asistencias.filter((a) => a.idAsociado === asistenciaQR.idAsociado && !a.confirmadoPorSecretaria);
    console.log(bodyAsistencia);
    
    if (!!bodyAsistencia) {
      this.fromQr = true;
      bodyAsistencia.map(async (asistencia) => {
        try {
          this.confirmarAsistencia(asistencia);
          if (this.fromQr && !asistencia.confirmadoPorSecretaria) {
            await this.manageConsultas(asistencia);
          }
        } catch (error) {
          console.log(error);
        }
      })
      this.loading = false;
    } else {
      this.ffsjAlertService.danger('Hubo un problema al procesar el QR');
      this.loading = false;
    }
  }

}
