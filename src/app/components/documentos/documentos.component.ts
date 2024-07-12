import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Documento, DocumentosPlenosService, DocumentosService } from '../../../api';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {

  srcDocument = '';

  documentos: Documento[] = []

  constructor(
    private documentosPlenosService: DocumentosPlenosService,
    private documentosService: DocumentosService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.getDocumentos();
  }

  getDocumentos() {
    let idPleno = this.cookieService.get('idPleno');
    this.documentosPlenosService.documentosPlenosIdGet(parseInt(idPleno)).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          for (let documento of response.documentos) { 
            console.log('Documento:', documento);
            
            this.documentosService.documentosIdGet(documento.idDocumento).subscribe({
              next: (response: any) => {
                if (response.status.status === 200) {
                  this.documentos.push(response.documentos[0]);
                }
              },
              error: (error) => {
                console.error(error);
              }
            });
          }
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
