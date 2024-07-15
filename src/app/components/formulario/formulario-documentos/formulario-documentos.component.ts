import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
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

  // Convertir de ISO 8601 a formato datetime-local (YYYY-MM-DDTHH:mm)
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
          this.documentosPlenosService.documentosPlenosPost({
            idDocumento: response.documentos,
            idPleno: this.punto!.idPleno
          }).subscribe({
            next: (response: any) => {
              if (response.status.status === 200) {
                console.log('DocumentoPleno creado -> ', response);
                // this.documentosExistentes.push(this.documentoSeleccionado!);
                // this.mostrarFormularioAction();
              }
            },
            error: (error) => {
              console.error(error);
            }
          })

          this.informacionPuntoDelDiaService.informacionPuntoDelDiaPost({
            idDocumento: response.documentos,
            idPunto: this.punto!.id
          }).subscribe({
            next: (response: any) => {
              if (response.status.status === 200) {
                console.log('InformacionPuntoDelDia creado -> ', response);
                // this.documentosExistentes.push(this.documentoSeleccionado!);
                // this.mostrarFormularioAction();
                this.mostrarFormularioAction(false, null)
              }
            },
            error: (error) => {
              console.error(error);
            }
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
        }
      });
    } else {
      this.documentoSeleccionado = documento;
      this.loadForm();
      this.mostrarFormulario = mostrarFormulario;
    }
  }

}
