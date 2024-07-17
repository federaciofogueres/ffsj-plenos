import { Component, Input } from '@angular/core';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { AsistenciaService, Pleno, ResponseAsistencias } from '../../../../api';
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
  showList: string = 'nuevos';

  constructor(
    private censoService: CensoService,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit() {
    this.loadAsociados();
  }

  subirExcel() {
    
  }

  handleFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {type: 'binary'});
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {header: 1});
      this.processExcelData(data);
    };
    reader.readAsBinaryString(file);
  }
  
  processExcelData(data: any[]) {
    // Asumiendo que cada fila del Excel contiene un NIF en la primera columna
    data.forEach((row) => {
      if (row[0]) { // Verifica que la fila tenga datos
        // Aquí puedes llamar a agregar() pasando el NIF como argumento
        // Por ejemplo: this.agregar(row[0]);
        // Asegúrate de ajustar la función agregar() para manejar este caso
        this.agregar(row[0]);
      }
    });
  }

  loadAsistentes() {
    this.asistenciaService.plenosIdPlenoAsistenciaGet(this.pleno!.id).subscribe({
      next: (response: ResponseAsistencias) => {
        console.log(response);
        this.asistentes = response.asistencias.map(asistencia => {
          const asociadoInfo = this.asociados.find(a => a.id === asistencia.idAsociado);
          return asociadoInfo!;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadAsociados() {
    this.loading = true;
    this.censoService.asociadosGet().subscribe({
      next: (response: any) => {
        console.log(response);
        this.asociados = response.asociados.sort((a: Asociado, b: Asociado) => a.nif.localeCompare(b.nif));
        this.asociadosFiltrados = [...this.asociados];
        this.loadAsistentes();
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
    this.nuevoAsistente = this.asociados.find(a => a.nif == event.target.value)!;
  }

  agregar(asistenteNif?: string) {
    if (asistenteNif) {
      this.nuevoAsistente = this.asociados.find(a => a.nif == asistenteNif)!;
    }
    if (this.nuevoAsistente) {
      const included = this.nuevosAsistentes.some(a => a.id === this.nuevoAsistente.id);
      if (!included) {
        this.nuevosAsistentes.push(this.nuevoAsistente);
      }
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
      }
      this.nuevosAsistentes = [];
      this.loadAsistentes();
    });


  }

  eliminar(asistente: Asociado) {
    this.nuevosAsistentes = this.nuevosAsistentes.filter(a => a.id !== asistente.id);
  }

}
