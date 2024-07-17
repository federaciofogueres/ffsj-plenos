import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FfsjAlertService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
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
    informacion_extra: '',
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
    private plenosService: PlenoService,
    private cookieService: CookieService,
    private route: Router,
    private ffsjAlertService: FfsjAlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadIdPleno(-1);
    this.setIdAsociado();
    this.loading = false;
  }

  setIdAsociado() {
    this.cookieService.get('idUsuario') ? this.idAsociado = parseInt(this.cookieService.get('idUsuario')) : this.idAsociado = 8976;
  }

  gestionaPleno(event: number) {
    this.loadIdPleno(event);
  }

  loadIdPleno(idPleno: number) {
    this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : idPleno;
    if (this.idPleno !== -1) {
      this.plenosService.plenoIdGet(this.idPleno).subscribe({
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
    } else {
      this.route.navigateByUrl('/plenos');
    }
  }

  confirmarAsistencia() {
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoPost(this.idPleno, this.idAsociado).subscribe({
      next: (resposne: any) => {
        if (resposne.status.status === 200) {
          console.log('Asistencia confirmada');
          this.ffsjAlertService.success('Asistencia confirmada correctamente');
        }
      },
      error: (error) => {
        console.log('Error al confirmar asistencia: ', error.error);
        this.ffsjAlertService.warning('Error al confirmar asistencia. Por favor, contacta con secretaría.');
      }
    
    })
  }



  delegarAsistencia() {
    console.log('Delegar asistencia a: ', this.delegacionAsistenciaForm.value.dni);
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoDelegacionNifAsociadoPost(this.idPleno, this.idAsociado, this.delegacionAsistenciaForm.value.dni).subscribe({
      next: (response: any) => {
        if (response.status.status === 200) {
          console.log('Delegación realizada -> ', response);
          this.ffsjAlertService.success('Asistencia delegada correctamente al socio: ' + this.delegacionAsistenciaForm.value.dni);
          this.cookieService.delete('idPleno');
          this.route.navigateByUrl('/home');
        }
      },
      error: (error) => {
        console.log('Error al delegar asistencia: ', error.error);
        this.ffsjAlertService.danger('Error al delegar asistencia. Por favor, inténtalo de nuevo.');
      }
    });
    
    this.showDelegacionAsistenciaForm = false;
  }
}
