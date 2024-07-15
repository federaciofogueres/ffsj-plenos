import { Component } from '@angular/core';
import { Pleno, PlenoService } from '../../../api';
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

  constructor(
    private plenosService: PlenoService,
  ) {}

  ngOnInit() {}

  plenoSeleccionado(event: any) {
    console.log(event);
    this.plenosService.plenoIdGet(event).subscribe({
      next: (response: any) => {
        this.pleno = response.plenos[0];
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


}
