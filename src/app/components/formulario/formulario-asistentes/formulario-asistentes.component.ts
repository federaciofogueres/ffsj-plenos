import { Component, Input } from '@angular/core';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of } from 'rxjs';
import { AsistenciaService, Pleno } from '../../../../api';
import { Asociado } from '../../../../external-api/asociado';
import { CensoService } from '../../../services/censo.service';

@Component({
  selector: 'app-formulario-asistentes',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-asistentes.component.html',
  styleUrl: './formulario-asistentes.component.scss'
})
export class FormularioAsistentesComponent {

  @Input() pleno: Pleno | null = null;

  asociados: Asociado[] = [];
  asociadosFiltrados: Asociado[] = [];
  asistentes: Asociado[] = [];
  nuevosAsistentes: Asociado[] = [];
  nuevoAsistente!: Asociado;

  loading: boolean = false;

  constructor(
    private censoService: CensoService,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit() {
    this.loadAsociados();
  }

  loadAsistentes() {
    // this.asistenciaService.asistenciaIdGet
  }

  loadAsociados() {
    this.loading = true;
    this.censoService.asociadosGet().subscribe({
      next: (response: any) => {
        console.log(response);
        this.asociados = response.asociados.sort((a: Asociado, b: Asociado) => a.nif.localeCompare(b.nif));
        this.asociadosFiltrados = [...this.asociados];
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  filtrarAsociados(busquedaEl: Event) {
    const busqueda = (busquedaEl.target as HTMLInputElement).value;
    if (!busqueda) {
      this.asociadosFiltrados = [...this.asociados];
    } else {
      this.asociadosFiltrados = this.asociados.filter(asociado =>
        asociado.nif.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
  }

  changeSelected(event: any) {
    this.nuevoAsistente = this.asociados.find(a => a.id === event.target.value)!;
  }

  agregar() {
    const included = this.nuevosAsistentes.some(a => a.id === this.nuevoAsistente.id);
    if (!included) {
      this.nuevosAsistentes.push(this.nuevoAsistente);
    }
  }

  guardar() {
    this.loading = true;
    if (this.nuevosAsistentes.length === 0) {
      this.loading = false;
      console.log('No hay asistentes nuevos');
      return;
    }

    if (!this.pleno) {
      this.loading = false;
      console.log('No se ha especificado el pleno');
      return;
    }

    const observables = this.nuevosAsistentes.map((asistente: Asociado) =>
      this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoPost(this.pleno!.id, asistente.id).pipe(
        catchError(error => {
          console.error(error);
          return of(null); // Emite un valor nulo para errores, para no detener el forkJoin.
        })
      )
    );
  
    forkJoin(observables).subscribe(results => {
      this.loading = false;
      if (results.includes(null)) {
        console.log('Hubo un error al guardar algunos asistentes');
      } else {
        console.log('Todos los asistentes se han guardado correctamente');
        this.nuevosAsistentes = [];
        // Asumiendo que tienes una función loadInfo() que necesitas llamar aquí.
        this.loadAsistentes();
      }
    });


  }

  eliminar(asistente: Asociado) {
    this.nuevosAsistentes = this.nuevosAsistentes.filter(a => a.id !== asistente.id);
  }

}
