import { Component } from '@angular/core';
import { Pleno, PlenoService } from '../../../api';
import { FormularioPlenoComponent } from '../formulario/formulario-pleno/formulario-pleno.component';
import { FormularioComponent } from '../formulario/formulario.component';
import { PlenosComponent } from "../plenos/plenos.component";

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    PlenosComponent,
    FormularioPlenoComponent,
    FormularioComponent
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent {

  loading: boolean = false;
  pleno: Pleno | null = null;
  mostrarFormulario: boolean = false;

  constructor(
    private plenosService: PlenoService,
  ) {}

  ngOnInit() {}

  plenoSeleccionado(event: any) {
    console.log(event);
    this.plenosService.plenoIdGet(event).subscribe({
      next: (response: any) => {
        this.pleno = response.plenos[0];
        this.mostrarFormularioAction(true, this.pleno);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  mostrarFormularioAction(mostrarFormulario: boolean, pleno: Pleno | null = null) {
    this.pleno = pleno;
    this.mostrarFormulario = mostrarFormulario;
    // if (!mostrarFormulario) {
    //   this.documentoForm.reset();
    //   this.mostrarFormulario = mostrarFormulario;
    //   this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(this.punto!.id).subscribe({
    //     next: (response: any) => {
    //       if (response.status.status === 200) {
    //         this.documentosExistentes = response.documentos;
    //         this.loading = false;
    //       }
    //     },
    //     error: (error) => {
    //       console.error(error);
    //       this.documentosExistentes = [];
    //       this.loading = false;
    //     }
    //   });
    // } else {
    //   this.documentoSeleccionado = documento;
    //   this.loadForm();
    //   this.mostrarFormulario = mostrarFormulario;
    // }
  }

}
