import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { AsistenciaService, Pleno, PlenoService } from '../../../api';
import { ValidatorsService } from '../../services/validators.service';
import { PlenosComponent } from '../plenos/plenos.component';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FfsjSpinnerComponent,
    PlenosComponent
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent {

  idPleno: number = -1;
  idAsociado: number = -1;
  pleno: Pleno = {
    id: 0,
    fecha: new Date(),
    titulo: '',
    informacionExtra: '',
    firma: ''
  };

  showDelegacionAsistenciaForm = false;
  delegacionAsistenciaForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, this.validatorsService.dniValidator]],
  });
  dniTouched = false;

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private asistenciaService: AsistenciaService,
    private activatedRoute: ActivatedRoute,
    private plenosService: PlenoService
  ) { }

  ngOnInit() {
    this.loading = true;
    let plenoIdRoute = this.activatedRoute.snapshot.paramMap.get('idPleno');
    if (plenoIdRoute) {
      this.loadIdPleno(parseInt(plenoIdRoute));
    }
    this.idAsociado = 8976;
    this.loading = false;
  }

  gestionaPleno(event: number) {
    this.loadIdPleno(event);
  }

  loadIdPleno(idPleno: number) {
    this.idPleno = idPleno;
    if (idPleno !== -1) {
      this.plenosService.plenoIdGet(idPleno).subscribe({
        next: (response: any) => {
          console.log('Pleno:', response);
          if (response.status.status === 200) {
            this.pleno = response.plenos[0];
          }
        },
        error: (error) => {
          console.log('Error:', error);
        }
      });
    }
  }

  confirmarAsistencia() {
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoPost(this.idPleno, this.idAsociado).subscribe({
      next: (resposne: any) => {
        if (resposne.status.status === 200) {
          console.log('Asistencia confirmada');
        }
      },
      error: (error) => {
        console.log('Error al confirmar asistencia: ', error.error);
      }
    
    })
  }

  delegarAsistencia() {
    console.log('Delegar asistencia a: ', this.delegacionAsistenciaForm.value.dni);
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoDelegacionNifAsociadoPost(this.idPleno, this.idAsociado, this.delegacionAsistenciaForm.value.dni).subscribe({
      next: (response: any) => {
        console.log('Delegación realizada -> ', response);
      },
      error: (error) => {
        console.log('Error al delegar asistencia: ', error.error);
      }
    });
    
    this.showDelegacionAsistenciaForm = false;
  }
}
