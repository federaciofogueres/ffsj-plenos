import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { Pleno, PlenoService, PuntoOrdenDelDia, PuntosOrdenDelDiaService } from '../../../../api';
import { FormularioAsistentesComponent } from '../formulario-asistentes/formulario-asistentes.component';
import { FormularioConsultasComponent } from '../formulario-consultas/formulario-consultas.component';
import { FormularioPuntoDelDiaComponent } from '../formulario-punto-del-dia/formulario-punto-del-dia.component';

type FormShowType = 'pleno' | 'ordenDelDia' | 'consultas' | 'asistentes';

@Component({
  selector: 'app-formulario-pleno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormularioPuntoDelDiaComponent,
    FormularioConsultasComponent,
    FormularioAsistentesComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-pleno.component.html',
  styleUrl: './formulario-pleno.component.scss'
})
export class FormularioPlenoComponent {

  loading: boolean = false;

  @Input() pleno: Pleno | null = null;
  @Output() nextPage: EventEmitter<void> = new EventEmitter();
  @Output() back: EventEmitter<void> = new EventEmitter();

  plenoForm!: FormGroup;
  formularioPage: number = 0;

  formShow: FormShowType = 'pleno';
  mostrarFormulario: boolean = false;

  puntosOrdenDelDia: PuntoOrdenDelDia[] = [];
  puntoSeleccionado: PuntoOrdenDelDia | null = null;

  constructor(
    private fb: FormBuilder,
    private plenoService: PlenoService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.loadForm();
    if (this.pleno) {
      this.loading = true;
      this.loadPuntosDelDia();
    }
  }

  loadForm() {
    this.plenoForm = this.fb.group({
      id: [{value: this.pleno ? this.pleno.id : '0', disabled: true}],
      fecha: [this.pleno ? this.convertirDateALocal(new Date(this.pleno.fecha)) : ''],
      titulo: [this.pleno ? this.pleno.titulo : ''],
      informacion_extra: [this.pleno ? this.pleno.informacion_extra : ''],
      firma: [this.pleno ? this.pleno.firma : '']
    });
  }

  onSubmit() {
    console.log(this.plenoForm.value);
  }

  procesar() {
    this.loading = true;
    if (this.plenoForm.valid) {
      if (this.pleno !== null) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.loading = false;
      console.log('Formulario inválido');
    }
  }

  create() {
    this.plenoForm.value.id = 0;
    this.plenoForm.value.fecha = this.convertirLocalaISO(this.plenoForm.value.fecha);
    this.plenoService.plenoPost(this.plenoForm.value).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          this.plenoService.plenoIdGet(response.plenos).subscribe({
            next: (pleno: any) => {
              this.pleno = pleno.plenos[0];
              // this.nextPage.emit();
              this.loading = false;
            },
            error: (error) => {
              console.error(error);
              this.loading = false;
            }
          });
        }
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  update() {
    this.plenoForm.value.id = this.pleno!.id;
    this.plenoForm.value.fecha = this.convertirLocalaISO(this.plenoForm.value.fecha);
    this.plenoService.plenoIdPut(this.plenoForm.value, this.pleno!.id).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          // this.mostrarFormularioAction(false);
          console.log('OK');
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  loadPuntosDelDia() {
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(this.pleno!.id).subscribe({
      next: (response: any) => {
        this.puntosOrdenDelDia = response.puntosOrdenDelDia;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  mostrarFormularioAction(mostrarFormulario: boolean, punto: PuntoOrdenDelDia | null = null) {
    if (!mostrarFormulario) {
      this.loadPuntosDelDia();
    }
    this.puntoSeleccionado = punto;
    this.mostrarFormulario = mostrarFormulario;
  }

}
