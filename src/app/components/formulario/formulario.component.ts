import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { Pleno, PuntoOrdenDelDia, PuntosOrdenDelDiaService } from '../../../api';
import { FormularioPlenoComponent } from './formulario-pleno/formulario-pleno.component';
import { FormularioPuntoDelDiaComponent } from './formulario-punto-del-dia/formulario-punto-del-dia.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormularioPlenoComponent,
    FormularioPuntoDelDiaComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {

  loading: boolean = false;

  @Input() pleno: Pleno | null = null;
  puntosOrdenDelDia: PuntoOrdenDelDia[] = [];

  puntoSeleccionado: PuntoOrdenDelDia | null = null;
  mostrarFormulario: boolean = false;

  formularioPage: number = 0;

  constructor(
    private fb: FormBuilder,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadPuntosDelDia();
  }

  nextPage() {
    console.log('Next Page');
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
