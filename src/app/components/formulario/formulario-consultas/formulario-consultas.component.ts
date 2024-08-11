import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of } from 'rxjs';
import { ConsultasService, Pleno } from '../../../../api';
import { Consulta } from '../../../../external-api/consulta';
import { ConsultasPlenoService } from '../../../services/consultas-pleno.service';
import { ConsultasInfoService } from '../../../services/consultas.service';

@Component({
  selector: 'app-formulario-consultas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FfsjSpinnerComponent
  ],
  templateUrl: './formulario-consultas.component.html',
  styleUrl: './formulario-consultas.component.scss'
})
export class FormularioConsultasComponent {

  @Input() pleno: Pleno | null = null;
  @Output() back: EventEmitter<void> = new EventEmitter<void>();

  loading: boolean = false;

  consultas: Consulta[] = [];
  consultasSeleccionadas: Consulta[] = [];
  consultaSeleccionada!: Consulta;

  consultasGuardadas: Consulta[] = [];

  constructor(
    private fb: FormBuilder,
    private consultasInfoService: ConsultasInfoService,
    private consultasService: ConsultasService,
    private consultasPlenoService: ConsultasPlenoService,
    protected router: Router,
    private ffsjAlertService: FfsjAlertService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadInfo();
  }
  
  async loadInfo() {
    await Promise.all([
      this.getAllConsultasAsync().catch(error => console.error('Error in getAllConsultasAsync:', error)),
      this.consultasPlenoService.getConsultasFromPlenoAsync(this.pleno!.id)
      .then((consultas: any) => {
        this.consultasGuardadas = consultas;
      })
      .catch(error => console.error('Error in getConsultasFromPlenoAsync:', error))
    ]).finally(() => this.loading = false);
  }
  
  private getAllConsultasAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.consultasInfoService.consultasGet().subscribe({
        next: (response: any) => {
          console.log(response);
          this.consultas = response.consultas;
          resolve();
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  changeSelected(event: any) {
    this.consultaSeleccionada = this.consultas.find(consulta => consulta.id === parseInt(event.target.value))!;
    this.agregarConsulta();
  }

  agregarConsulta() {
    const included = this.consultasSeleccionadas.some(consulta => consulta.id === this.consultaSeleccionada.id);
    if (!included) {
      this.consultasSeleccionadas.push(this.consultaSeleccionada);
    } else {
      console.log('La consulta seleccionada ya está incluida');
    }
  }

  eliminarConsulta(consulta: Consulta) {
    this.consultasSeleccionadas = this.consultasSeleccionadas.filter(c => c.id !== consulta.id);
  }

  guardarConsultas() {
    this.loading = true;
    console.log(this.consultasSeleccionadas);
    if (this.consultasSeleccionadas.length === 0) {
      console.log('No hay consultas para guardar');
      return;
    }

    if (!this.pleno) {
      console.error('No se ha seleccionado ningún pleno');
      return;
    }
  
    const observables = this.consultasSeleccionadas.map((consulta: Consulta) =>
      this.consultasService.consultasPost({idPleno: this.pleno!.id, idConsulta: consulta.id}).pipe(
        catchError(error => {
          console.error(error);
          return of(null); // Emite un valor nulo para errores, para no detener el forkJoin.
        })
      )
    );
  
    forkJoin(observables).subscribe(results => {
      if (results.includes(null)) {
        console.log('error');
        this.ffsjAlertService.danger('Error al guardar las consultas');
      } else {
        console.log('Todas las consultas se han guardado correctamente');
      }
      this.consultasSeleccionadas = [];
      this.loadInfo();
    });
  }

}
