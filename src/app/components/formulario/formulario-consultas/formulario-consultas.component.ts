import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { catchError, forkJoin, of } from 'rxjs';
import { ConsultasService, Pleno } from '../../../../api';
import { Consulta } from '../../../../external-api/consulta';
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

  loading: boolean = false;

  consultas: Consulta[] = [];
  consultasSeleccionadas: Consulta[] = [];
  consultaSeleccionada!: Consulta;

  consultasGuardadas: Consulta[] = [];

  constructor(
    private fb: FormBuilder,
    private consultasInfoService: ConsultasInfoService,
    private consultasService: ConsultasService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadInfo();
  }
  
  async loadInfo() {
    await Promise.all([
      this.getAllConsultasAsync().catch(error => console.error('Error in getAllConsultasAsync:', error)),
      this.getConsultasFromPlenoAsync().catch(error => console.error('Error in getConsultasFromPlenoAsync:', error))
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
  
  private async getConsultasFromPlenoAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.consultasService.consultasIdGet(this.pleno!.id).subscribe({
        next: async (response: any) => {
          console.log(response);
          this.consultasGuardadas = [];
          const consultasPromises = response.consultas.map((consulta: any) => 
            new Promise((resolveConsulta, rejectConsulta) => {
              this.consultasInfoService.consultasIdGet(consulta.idConsulta).subscribe({
                next: (responseConsulta: any) => {
                  console.log(responseConsulta);
                  this.consultasGuardadas.push(responseConsulta.consulta);
                  resolveConsulta(null); // Resuelve la promesa interna
                },
                error: (errorConsulta) => {
                  console.error(errorConsulta);
                  rejectConsulta(errorConsulta); // Rechaza la promesa interna
                }
              });
            })
          );
  
          // Espera a que todas las promesas del array se resuelvan
          Promise.all(consultasPromises).then(() => {
            resolve(); // Resuelve la promesa externa una vez que todas las consultas están cargadas
          }).catch((error) => {
            console.error('Error loading consultas:', error);
            reject(error); // Rechaza la promesa externa si alguna consulta falla
          });
        },
        error: (error) => {
          console.error(error);
          reject(error); // Rechaza la promesa externa si la llamada inicial falla
        }
      });
    });
  }

  changeSelected(event: any) {
    this.consultaSeleccionada = this.consultas.find(consulta => consulta.id === parseInt(event.target.value))!;
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
      } else {
        console.log('Todas las consultas se han guardado correctamente');
        this.consultasSeleccionadas = [];
        this.loadInfo();
      }
    });
  }

}
