import { Component, Input } from '@angular/core';
import * as QRCode from 'qrcode';
import { Asistencia } from '../../../api';
import { EncoderService } from '../../../lib/ffsj-web-components';

@Component({
  selector: 'app-qr-card',
  standalone: true,
  imports: [],
  templateUrl: './qr-card.component.html',
  styleUrl: './qr-card.component.scss'
})
export class QrCardComponent {

  @Input() asistencia: Asistencia = {
    idPleno: 0,
    idAsociado: 0,
    delegado: false,
    asistenciaConfirmada: false,
    asistenciaConfirmadaPorSecretaria: false
  };
  qrCodeUrl: string= '';

  constructor(
    private encoderService: EncoderService
  ) {}

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    QRCode.toDataURL(this.encoderService.encrypt(JSON.stringify(this.asistencia)), (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      this.qrCodeUrl = url; // Store the QR code URL
    });
  }
}
