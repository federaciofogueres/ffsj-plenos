import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { Documento, DocumentosService, Pleno, PuntoOrdenDelDia, PuntosOrdenDelDiaService, Votacion, VotacionesService } from '../../../../api';
import { FormularioDocumentosComponent } from '../formulario-documentos/formulario-documentos.component';
import { FormularioVotacionesComponent } from '../formulario-votaciones/formulario-votaciones.component';

type FormShowType = 'puntoDelDia' | 'documentos' | 'votaciones';

@Component({
  selector: 'app-formulario-punto-del-dia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormularioDocumentosComponent,
    FormularioVotacionesComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-punto-del-dia.component.html',
  styleUrl: './formulario-punto-del-dia.component.scss'
})
export class FormularioPuntoDelDiaComponent {

  loading: boolean = false;

  @Output() nextPage: EventEmitter<void> = new EventEmitter();
  @Output() back: EventEmitter<void> = new EventEmitter();

  @Input() pleno: Pleno | null = null;
  @Input() puntoOrdenDelDia: PuntoOrdenDelDia | null = null;

  documentos: Documento[] = [];
  votaciones: Votacion[] = [];
  documentoSeleccionado: Documento | null = null;
  votacionSeleccionada: Votacion | null = null;

  ordenDiaForm!: FormGroup;
  documentoForm!: FormGroup;
  votacionForm!: FormGroup;
  formularioPage: number = 0;

  formShow: FormShowType = 'puntoDelDia';

  constructor(
    private fb: FormBuilder,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    private documentosService: DocumentosService,
    private votacionesService: VotacionesService
  ) { }

  ngOnInit(): void {
    this.loadForm();
    if (this.puntoOrdenDelDia) {
      this.loading = true;
      this.loadInfo();
    }
  }

  loadInfo() {
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(this.puntoOrdenDelDia!.id).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.status.status === 200) {
          this.documentos = response.documentos;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdVotacionesGet(this.puntoOrdenDelDia!.id).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.status.status === 200) {
          this.votaciones = response.votaciones;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.loading = false;
  }

  loadForm() {
    this.ordenDiaForm = this.fb.group({
      id: [{value: this.puntoOrdenDelDia ? this.puntoOrdenDelDia.id : '0', disabled: true}],
      titulo: [this.puntoOrdenDelDia ? this.puntoOrdenDelDia.titulo : ''],
      texto: [this.puntoOrdenDelDia ? this.puntoOrdenDelDia.texto : ''],
      idPleno: [this.pleno?.id ? this.pleno.id : 0]
    });
  }

  onSubmit() {
    console.log(this.ordenDiaForm.value);
  }

  changeFormShow(formShow: FormShowType) {
    this.formShow = formShow;
  }

  procesar(form: FormGroup){
    console.log('Formulario -> ', form.value);
    if (form.valid) {
      if (this.puntoOrdenDelDia !== null) {
        this.edit();
      } else {
        this.create();
      }
    } else {
      console.log('Formulario NOT OK -> ', form.value);
    }
  }

  edit() {
    this.ordenDiaForm.value.id = this.puntoOrdenDelDia!.id;
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdPut(this.ordenDiaForm.value, this.puntoOrdenDelDia!.id).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.status.status === 200) {
          console.log('Punto del día actualizado -> ', response);
          this.getPuntoDelDia(this.puntoOrdenDelDia!.id);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  create() {
    this.ordenDiaForm.value.id = 0;
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaPost(this.ordenDiaForm.value).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.status.status === 200) {
          let idPunto = response.puntosOrdenDelDia;
          this.getPuntoDelDia(idPunto);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getPuntoDelDia(idPunto: number) {
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(this.pleno!.id).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.status.status === 200) {
          this.puntoOrdenDelDia = response.puntosOrdenDelDia.filter((punto: PuntoOrdenDelDia) => punto.id === idPunto)[0];
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  borrarItem() {
    if (window.confirm('¿Estás seguro de que deseas borrar este punto del día?')) {
      let observables = [];
      for (let documento of this.documentos) {
        observables.push(this.borrarDocumento(documento));
      }
      for (let votacion of this.votaciones) {
        observables.push(this.borrarVotacion(votacion));
      }
      observables.push(this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDelete(this.puntoOrdenDelDia!.id));
    
      forkJoin(observables).subscribe({
        next: (responses) => {
          console.log('Todas las operaciones de borrado completadas', responses);
          this.back.emit(); // Mover this.back.emit() aquí asegura que se ejecute después de todas las operaciones de borrado
        },
        error: (error) => {
          console.error('Error en las operaciones de borrado', error);
          // Manejar el error como sea apropiado
        }
      });
    }
  }

  // Ejemplo de cómo podría modificarse borrarDocumento para devolver el observable
  borrarDocumento(documento: Documento) {
    return this.documentosService.documentosIdDelete(documento.id).pipe(
      tap((response: any) => {
        if (response.status.status === 200) {
          console.log('Documento eliminado -> ', response);
        }
      }),
      catchError((error) => {
        console.error('Error al borrar documento', error);
        return of(null); // Manejar el error o devolver un valor por defecto
      })
    );
  }

  // Ejemplo de cómo podría modificarse borrarDocumento para devolver el observable
  borrarVotacion(votacion: Votacion) {
    return this.votacionesService.votacionesIdDelete(votacion.id).pipe(
      tap((response: any) => {
        if (response.status.status === 200) {
          console.log('Votación eliminada -> ', response);
        }
      }),
      catchError((error) => {
        console.error('Error al borrar votación', error);
        return of(null); // Manejar el error o devolver un valor por defecto
      })
    );
  }

}
