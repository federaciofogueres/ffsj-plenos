import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-aviso-numero-asistencias-asamblea',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './aviso-numero-asistencias-asamblea.component.html',
  styleUrl: './aviso-numero-asistencias-asamblea.component.scss'
})
export class AvisoNumeroAsistenciasAsambleaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AvisoNumeroAsistenciasAsambleaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { asistencias: number }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close();
  }
}
