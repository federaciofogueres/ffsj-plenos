import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { PuntoOrdenDelDia, PuntosOrdenDelDiaService, Votacion, VotacionesService } from '../../../../api';

@Component({
  selector: 'app-formulario-votaciones',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-votaciones.component.html',
  styleUrl: './formulario-votaciones.component.scss'
})
export class FormularioVotacionesComponent {

  loading: boolean = false;

  @Output() back: EventEmitter<void> = new EventEmitter();
  @Input() votaciones: Votacion[] = [];
  @Input() punto: PuntoOrdenDelDia | null = null;

    votacionSeleccionada: Votacion | null = null;

    votacionForm!: FormGroup;
  
    mostrarFormulario: boolean = false;

    constructor(
      private fb: FormBuilder,
      private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
      private votacionesService: VotacionesService
    ) { }
  
    ngOnInit(): void {
      this.loadForm();
    }
  
    loadForm() {
      this.votacionForm = this.fb.group({
        id: [{value: this.votacionSeleccionada ? this.votacionSeleccionada.id : '0', disabled: true}],
        fecha: [this.votacionSeleccionada ? this.votacionSeleccionada.fecha.toString().split('T')[0] : ''],
        infoExtra: [this.votacionSeleccionada ? this.votacionSeleccionada.infoExtra : ''],
        favor: [this.votacionSeleccionada ? this.votacionSeleccionada.favor : ''],
        contra: [this.votacionSeleccionada ? this.votacionSeleccionada.contra : ''],
        blanco: [this.votacionSeleccionada ? this.votacionSeleccionada.blanco : ''],
        idPunto: [this.votacionSeleccionada ? this.votacionSeleccionada.idPunto : '']
      });
    }

  // Convertir de Date a formato datetime-local (YYYY-MM-DDTHH:mm)
  convertirDateALocal(inputDate: Date): string {
    inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset());
    return inputDate.toISOString().slice(0, 16); // Elimina los segundos y la zona horaria
  }

  procesar() {
    this.loading = true;
    if (this.votacionForm.valid) {
      if (this.votacionSeleccionada !== null) {
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
    this.votacionForm.value.id = 0;
    this.votacionForm.value.idPunto = this.punto!.id;
    this.votacionForm.value.fecha = new Date(this.votacionForm.get('fecha')?.value);
    this.votacionesService.votacionesPost(this.votacionForm.value).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          this.mostrarFormularioAction(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  update() {
    this.votacionForm.value.id = this.votacionSeleccionada!.id;
    this.votacionForm.value.idPunto = this.punto!.id;
    this.votacionesService.votacionesIdPut(this.votacionForm.value, this.votacionSeleccionada!.id).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          this.mostrarFormularioAction(false);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  mostrarFormularioAction(mostrarFormulario: boolean, documento: Votacion | null = null) {
    if (!mostrarFormulario) {
      this.votacionForm.reset();
      this.mostrarFormulario = mostrarFormulario;
      this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdVotacionesGet(this.punto!.id).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            this.votaciones = response.votaciones;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error(error);
          this.votaciones = [];
          this.loading = false;
        }
      });
    } else {
      this.votacionSeleccionada = documento;
      this.loadForm();
      this.mostrarFormulario = mostrarFormulario;
      this.loading = false;
    }
  }

  borrarItem() {
    this.loading = true;
    if (window.confirm('¿Deseas borrar esta votación?')) {
      this.votacionesService.votacionesIdDelete(this.votacionSeleccionada!.id).subscribe({
        next: (response: any) => {
          if (response.status.status === 200) {
            console.log('Votación eliminada -> ', response);
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
