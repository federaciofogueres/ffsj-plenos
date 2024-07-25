import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EncoderService, FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { Asistencia, AsistenciaService } from '../../../api';
import { AsistenciaPlenoFormattedModel } from '../../models/asistencia-pleno.model';
import { AsistenciaPlenoService } from '../../services/asistencia-pleno.service';
import { CensoService } from '../../services/censo.service';
import { PlenoExtraService } from '../../services/pleno-extra.service';

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

  private idPleno = -1;
  protected asistencias: AsistenciaPlenoFormattedModel[] = [];

  protected loading: boolean = false;

  constructor(
    private cookieService: CookieService,
    private asistenciaService: AsistenciaService,
    private ffsjAlertService: FfsjAlertService,
    private censoService: CensoService,
    private asistenciaPlenoService: AsistenciaPlenoService,
    private plenoExtraService: PlenoExtraService,
    private encoderService: EncoderService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadAsistencia();
    } else {
      this.ffsjAlertService.warning('No se ha seleccionado ningún pleno');
    }
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
    this.qrResultString = resultString;
    console.log('QR code scanned:', resultString);
    this.qrResultStringDecoded = this.encoderService.decrypt(this.qrResultString);
    // Aquí puedes añadir la lógica para manejar el resultado del código QR
  }

}
