import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Consulta } from '../../../../external-api/consulta';

@Component({
  selector: 'app-consultas-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './consultas-dialog.component.html',
  styleUrl: './consultas-dialog.component.scss'
})
export class ConsultasDialogComponent {
  selectedConsulta: Consulta = {
    id: 0,
    fecha: '',
    titulo: '',
    votosTotales: 0,
    preguntas: []
  };

  constructor(
    public dialogRef: MatDialogRef<ConsultasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consultas: Consulta[] }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedConsulta);
  }
}
