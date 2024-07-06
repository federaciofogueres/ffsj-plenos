import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent {

  showDelegacionAsistenciaForm = false;
  delegacionAsistenciaForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, this.validatorsService.dniValidator]],
  });
  dniTouched = false;

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) { }

  delegarAsistencia() {
    console.log('Delegar asistencia a: ', this.delegacionAsistenciaForm.value.dni);
    
    this.showDelegacionAsistenciaForm = false;
  }
}
