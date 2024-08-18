import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Consulta } from '../../../../external-api/consulta';
import { AsistenciaPlenoFormattedModel } from '../../../models/asistencia-pleno.model';

@Component({
  selector: 'app-consultas-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './consultas-dialog.component.html',
  styleUrl: './consultas-dialog.component.scss'
})
export class ConsultasDialogComponent {
  selectedConsultas: Consulta[] = [];
  cargo: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConsultasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consultas: Consulta[], asistencia: AsistenciaPlenoFormattedModel }
  ) {
    switch (data.asistencia.idCargo) {
      case 1:
        this.cargo = 'Presidencia de foguera';
        break;
      case 4:
        this.cargo = 'Delegación de federación de foguera';
        break;
      case 19:
        this.cargo = 'Presidencia de barraca';
        break;
      case 20:
        this.cargo = 'Delegación de federación de barraca';
        break;
      default:
        this.cargo = 'Asistencia delegada';
        break;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedConsultas);
  }

  processConsulta(event: Consulta) {
    if (this.selectedConsultas.includes(event)) {
      this.selectedConsultas = this.selectedConsultas.filter((c) => c !== event);
    } else {
      this.selectedConsultas.push(event);
    }
  }

}
