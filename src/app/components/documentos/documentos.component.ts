import { Component } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentoModel } from '../../models/documento.model';

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

  documentos: DocumentoModel[] = [
    {
      id: 0,
      nombre: 'Acta asamblea anterior',
      descripcion: 'Acta de la asamblea anterior a la actual',
      url: 'https://intranet.hogueras.es/wp-content/uploads/2024/05/Acta-asamblea-26-02-2024.pdf'
    },
    {
      id: 1,
      nombre: 'Candidatura foguera ejemplar 2024',
      descripcion: 'Candidatura foguera ejemplar 2024',
      url: 'https://intranet.hogueras.es/wp-content/uploads/2024/06/Candidatura-Foguera-ejemplar-2024.pdf'
    },
    {
      id: 2,
      nombre: 'Candidatura foguera ejemplar infantil 2024',
      descripcion: 'Candidatura foguera ejemplar infantil 2024',
      url: 'https://intranet.hogueras.es/wp-content/uploads/2024/06/Candidatura-Foguera-Infantil-ejemplar-2024.pdf'
    },
    {
      id: 3,
      nombre: 'Candidatura barraca ejemplar 2024',
      descripcion: 'Candidatura barraca ejemplar 2024',
      url: 'https://intranet.hogueras.es/wp-content/uploads/2024/06/Candidatura-Barraca-ejemplar-2024.pdf'
    }
  ]

}
