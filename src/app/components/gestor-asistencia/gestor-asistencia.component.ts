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
  protected asistencias: AsistenciaPlenoFormattedModel[] = [];

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
      this.asistencias = asistencias;
    }).catch((error) => {
      this.ffsjAlertService.danger('Error al cargar las asistencias: ' + error);
    }).finally(() => {
      this.loading = false;
    });
  }

  confirmarAsistencia(asistencia: AsistenciaPlenoFormattedModel) {
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
          console.log(this.consultasPlenos);
          
          if (this.fromQr && asistenciaBody.asistenciaConfirmadaPorSecretaria) {
            // Abrir el diálogo
            const dialogRef = this.dialog.open(ConsultasDialogComponent, {
              data: { consultas: this.consultasPlenos },
              panelClass: 'custom-dialog-container'
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                console.log('129 -> ', result);
                
                this.consultasInfoService.consultasIdConsultaAutorizadosPost({idConsulta: result.id, idAsociado: asistenciaBody.idAsociado}, result.id).subscribe({
                  next: (data: any) => {
                    console.log('133 -> ', data);
                    if (data.status.status !== 200) {
                      this.ffsjAlertService.danger('Error al autorizar al asociado: ' + data.status.message);
                    } else {
                      this.ffsjAlertService.success('Usuario autorizado correctamente');
                    }
                    this.loading = false;
                  },
                  error: (error) => {
                    console.error('141 -> Error al autorizar al asociado: ', error);
                    this.ffsjAlertService.danger('Error al autorizar al asociado: ' + error);
                    this.loading = false;
                  }
                });
                console.log('Consulta seleccionada:', result);
              }
            });
          }
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

  onCodeResult(resultString: string) {
    this.loading = true;
    this.scanQRMode = false;
    this.qrResultString = resultString;
    console.log('QR code scanned:', resultString);
    this.qrResultStringDecoded = this.encoderService.decrypt(this.qrResultString);
    let asistenciaQR: Asistencia = JSON.parse(this.qrResultStringDecoded);
    const bodyAsistencia: AsistenciaPlenoFormattedModel | undefined = this.asistencias.find((a) => a.id === asistenciaQR.idAsociado && !a.confirmadoPorSecretaria);
    console.log(bodyAsistencia);
    
    if (bodyAsistencia) {
      this.fromQr = true;
      this.confirmarAsistencia(bodyAsistencia);
    } else {
      this.ffsjAlertService.danger('Hubo un problema al procesar el QR');
      this.loading = false;
    }
  }

}
