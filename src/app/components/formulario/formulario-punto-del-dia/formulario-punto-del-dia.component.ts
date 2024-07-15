import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { Documento, Pleno, PuntoOrdenDelDia, PuntosOrdenDelDiaService, Votacion } from '../../../../api';
import { FormularioDocumentosComponent } from '../formulario-documentos/formulario-documentos.component';

type FormShowType = 'puntoDelDia' | 'documentos' | 'votaciones';

@Component({
  selector: 'app-formulario-punto-del-dia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormularioDocumentosComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-punto-del-dia.component.html',
  styleUrl: './formulario-punto-del-dia.component.scss'
})
export class FormularioPuntoDelDiaComponent {

  loading: boolean = false;

  @Output() nextPage: EventEmitter<void> = new EventEmitter();
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
    this.votacionForm = this.fb.group({
      id: [{value: this.votacionSeleccionada ? this.votacionSeleccionada.id : '0', disabled: true}],
      fecha: [this.votacionSeleccionada ? this.votacionSeleccionada.fecha : ''],
      infoExtra: [this.votacionSeleccionada ? this.votacionSeleccionada.infoExtra : ''],
      favor: [this.votacionSeleccionada ? this.votacionSeleccionada.favor : ''],
      contra: [this.votacionSeleccionada ? this.votacionSeleccionada.contra : ''],
      blanco: [this.votacionSeleccionada ? this.votacionSeleccionada.blanco : ''],
      idPunto: [this.votacionSeleccionada ? this.votacionSeleccionada.idPunto : '']
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
      form.value.id = 0;
      console.log('Formulario OK -> ', form.value);
      this.puntosOrdenDelDiaService.puntosOrdenDelDiaPost(form.value).subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          if (response.status.status === 200) {
            let idPunto = response.puntosOrdenDelDia;
            this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(this.pleno!.id).subscribe({
              next: (response: any) => {
                console.log('Response:', response);
                if (response.status.status === 200) {
                  this.puntoOrdenDelDia = response.puntosOrdenDelDia.filter((punto: PuntoOrdenDelDia) => punto.id === idPunto)[0];
                  // this.nextPage.emit();
                }
              },
              error: (error) => {
                console.error(error);
              }
            });
          }
          // this.nextPage.emit();
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      console.log('Formulario NOT OK -> ', form.value);
    }
  }

}
