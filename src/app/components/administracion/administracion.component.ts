import { Component } from '@angular/core';
import { ConsultasService, Documento, DocumentosPlenosService, DocumentosService, Pleno, PlenoService, PuntoOrdenDelDia, PuntosOrdenDelDiaService, Votacion, VotacionesService } from '../../../api';
import { FormularioComponent } from '../formulario/formulario.component';
import { PlenosComponent } from "../plenos/plenos.component";

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    PlenosComponent,
    FormularioComponent
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent {

  loading: boolean = false;
  pleno: Pleno | null = null;
  puntosOrdenDelDia: PuntoOrdenDelDia[] = [];
  documentos: Documento[] = [];
  votaciones: Votacion[] = [];

  constructor(
    private plenosService: PlenoService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    private consultasService: ConsultasService,
    private documentosPlenosService: DocumentosPlenosService,
    private documentosService: DocumentosService,
    private votacionesService: VotacionesService,
  ) {}

  ngOnInit() {}

  plenoSeleccionado(event: any) {
    console.log(event);
    this.plenosService.plenoIdGet(event).subscribe({
      next: (response: any) => {
        this.pleno = response.plenos[0];
        this.loadPlenoData(response.plenos[0].id);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  loadPlenoData(idPleno: number) {
    this.loadPuntosOrdenDelDia(idPleno);
  }

  loadConsultas(){}
  loadPuntosOrdenDelDia(idPleno: number){
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(idPleno).subscribe({
      next: (response: any) => {
        this.puntosOrdenDelDia = response.puntosOrdenDelDia;
        console.log('Puntos Orden del Día:', response);
        response.puntosOrdenDelDia.map((puntoOrdenDelDia: any) => {
          this.loadDocumentos(puntoOrdenDelDia.id);
          this.loadVotaciones(puntoOrdenDelDia.id);
        });
      },
      error: (error) => {
        console.error(error);
      }
    
    })
  }
  loadDocumentos(idPunto: number){
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(idPunto).subscribe({
      next: (response: any) => {
        console.log('Documentos:', response);
        this.documentos = response.documentos;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadVotaciones(idPunto: number){
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdVotacionesGet(idPunto).subscribe({
      next: (response: any) => {
        console.log('Votaciones:', response);
        this.votaciones = response.votaciones;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
