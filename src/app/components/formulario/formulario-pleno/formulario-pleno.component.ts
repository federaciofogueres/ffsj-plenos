import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pleno } from '../../../../api';

@Component({
  selector: 'app-formulario-pleno',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './formulario-pleno.component.html',
  styleUrl: './formulario-pleno.component.scss'
})
export class FormularioPlenoComponent {

  @Input() pleno: Pleno | null = null;
  @Output() nextPage: EventEmitter<void> = new EventEmitter();

  plenoForm!: FormGroup;
  formularioPage: number = 0;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.plenoForm = this.fb.group({
      id: [{value: this.pleno ? this.pleno.id : '', disabled: true}],
      fecha: [this.pleno ? this.pleno.fecha : ''],
      titulo: [this.pleno ? this.pleno.titulo : ''],
      informacion_extra: [this.pleno ? this.pleno.informacion_extra : ''],
      firma: [this.pleno ? this.pleno.firma : '']
    });
  }

  onSubmit() {
    console.log(this.plenoForm.value);
  }

}
