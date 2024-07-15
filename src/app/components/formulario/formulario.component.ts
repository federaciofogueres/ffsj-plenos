import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Pleno, PuntoOrdenDelDia } from '../../../api';
import { FormularioPlenoComponent } from './formulario-pleno/formulario-pleno.component';
import { FormularioPuntoDelDiaComponent } from './formulario-punto-del-dia/formulario-punto-del-dia.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormularioPlenoComponent,
    FormularioPuntoDelDiaComponent
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {

  @Input() pleno: Pleno | null = null;
  @Input() puntosOrdenDelDia: PuntoOrdenDelDia[] = [];

  puntoSeleccionado: PuntoOrdenDelDia | null = null;
  mostrarFormulario: boolean = false;

  formularioPage: number = 0;

  constructor(
    private fb: FormBuilder
  ) { }

  nextPage() {
    console.log('Next Page');
    
  }

  mostrarFormularioAction(mostrarFormulario: boolean, punto: PuntoOrdenDelDia | null = null) {
    this.puntoSeleccionado = punto;
    this.mostrarFormulario = mostrarFormulario;
  }

}
