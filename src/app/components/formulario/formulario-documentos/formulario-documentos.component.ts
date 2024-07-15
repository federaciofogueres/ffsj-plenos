import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of } from 'rxjs';
import { Documento, DocumentosPlenosService, DocumentosService, InformacionPuntoDelDiaService, PuntoOrdenDelDia, PuntosOrdenDelDiaService } from '../../../../api';

@Component({
  selector: 'app-formulario-documentos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-documentos.component.html',
  styleUrl: './formulario-documentos.component.scss'
})
export class FormularioDocumentosComponent {

  loading: boolean = false;

  @Output() back: EventEmitter<void> = new EventEmitter();
  @Input() documentosExistentes: Documento[] = [];
  @Input() punto: PuntoOrdenDelDia | null = null;

  // @Output() nextPage: EventEmitter<void> = new EventEmitter();
  documentoSeleccionado: Documento | null = null;

  documentoForm!: FormGroup;

  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private documentosService: DocumentosService,
    private documentosPlenosService: DocumentosPlenosService,
    private informacionPuntoDelDiaService: InformacionPuntoDelDiaService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.documentoForm = this.fb.group({
      id: [{value: this.documentoSeleccionado ? this.documentoSeleccionado.id : '0', disabled: true}],
      fecha_creacion: [this.documentoSeleccionado ? this.convertirDateALocal(new Date(this.documentoSeleccionado.fecha_creacion)) : ''],
      titulo: [this.documentoSeleccionado ? this.documentoSeleccionado.titulo : ''],
      descripcion: [this.documentoSeleccionado ? this.documentoSeleccionado.descripcion : ''],
      autor: [this.documentoSeleccionado ? this.documentoSeleccionado.autor : ''],
      url: [this.documentoSeleccionado ? this.documentoSeleccionado.url : '']
    });
  }
  
  procesar() {
    this.loading = true;
    if (this.documentoForm.valid) {
      if (this.documentoSeleccionado !== null) {
        this.updateDocumento(this.documentoForm);
      } else {
        this.crearDocumento(this.documentoForm);
      }
    } else {
      this.loading = false;
      console.log('Formulario inválido');
    }
  }

  // Convertir de Date a formato datetime-local (YYYY-MM-DDTHH:mm)
  convertirDateALocal(inputDate: Date): string {
    inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset());
    return inputDate.toISOString().slice(0, 16); // Elimina los segundos y la zona horaria
  }

  convertirLocalaISO(inputLocal: string): string {
    const fecha = new Date(inputLocal);
    return new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000)).toISOString();
  }

  updateDocumento(form: FormGroup) {
    form.value.id = this.documentoSeleccionado!.id;
    form.value.fecha_creacion = this.convertirLocalaISO(form.value.fecha_creacion);
    this.documentosService.documentosIdPut(form.value, form.value.id).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          console.log('Documento actualizado -> ', response);
          this.mostrarFormularioAction(false, null);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  crearDocumento(form: FormGroup) {
    form.value.id = 0;
    form.value.fecha_creacion = this.convertirLocalaISO(form.value.fecha_creacion);
    this.documentosService.documentosPost(form.value).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          console.log('Documento creado -> ', response);

          const documentosPlenosObservable = this.documentosPlenosService.documentosPlenosPost({
            idDocumento: response.documentos,
            idPleno: this.punto!.idPleno
          }).pipe(
            catchError(error => {
              console.error('Error en documentosPlenosPost', error);
              return of(null); // Devuelve un observable nulo para manejar el error sin detener el forkJoin
            })
          );
          
          const informacionPuntoDelDiaObservable = this.informacionPuntoDelDiaService.informacionPuntoDelDiaPost({
            idDocumento: response.documentos,
            idPunto: this.punto!.id
          }).pipe(
            catchError(error => {
              console.error('Error en informacionPuntoDelDiaPost', error);
              return of(null); // Similar al anterior
            })
          );
          
          // Ejecutar ambas operaciones simultáneamente y manejar los resultados
          forkJoin([documentosPlenosObservable, informacionPuntoDelDiaObservable]).subscribe({
            next: ([resultDocumentosPlenos, resultInformacionPuntoDelDia]: [any, any]) => {
              if (resultDocumentosPlenos && resultInformacionPuntoDelDia) {
                console.log('Ambas operaciones exitosas');
                // Proceder con la lógica de éxito aquí
                this.mostrarFormularioAction(false, null);
              } else {
                // Si alguna operación falló, determinar cuál fue y ejecutar la operación de borrado correspondiente
                if (!resultDocumentosPlenos) {
                  console.log('Necesario borrar InformacionPuntoDelDia debido a fallo en DocumentosPlenos');
                  // Llamar al endpoint de 'delete' para InformacionPuntoDelDia
                }
                if (!resultInformacionPuntoDelDia) {
                  console.log('Necesario borrar DocumentosPlenos debido a fallo en InformacionPuntoDelDia');
                  // Llamar al endpoint de 'delete' para DocumentosPlenos
                }
              }
            },
            error: error => console.error('Error en la ejecución conjunta', error)
          });

        }
      },
      error: (error) => {
        console.error(error);
      }
    
    });
  }

  mostrarFormularioAction(mostrarFormulario: boolean, documento: Documento | null = null) {
    if (!mostrarFormulario) {
      this.documentoForm.reset();
      this.mostrarFormulario = mostrarFormulario;
      this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(this.punto!.id).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            this.documentosExistentes = response.documentos;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error(error);
          this.documentosExistentes = [];
          this.loading = false;
        }
      });
    } else {
      this.documentoSeleccionado = documento;
      this.loadForm();
      this.mostrarFormulario = mostrarFormulario;
    }
  }

  borrarItem() {
    this.loading = true;
    if (window.confirm('¿Deseas borrar este documento?')) {
      this.documentosService.documentosIdDelete(this.documentoSeleccionado!.id).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            console.log('Documento eliminado -> ', response);
            this.mostrarFormularioAction(false, null);
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

}
