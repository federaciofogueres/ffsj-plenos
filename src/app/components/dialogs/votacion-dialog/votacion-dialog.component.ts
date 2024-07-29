import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Votacion } from '../../../../api';

@Component({
  selector: 'app-votacion-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './votacion-dialog.component.html',
  styleUrl: './votacion-dialog.component.scss'
})
export class VotacionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<VotacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { votacion: Votacion }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(voto: number): void {
    let resultado = Object.assign({}, this.data.votacion);
    if (voto === 0) { 
      resultado.blanco = 1;
      resultado.favor = 0;
      resultado.contra = 0;
    } else if (voto === 1) {
      resultado.blanco = 0;
      resultado.favor = 1;
      resultado.contra = 0;
    } else {
      resultado.blanco = 0;
      resultado.favor = 0;
      resultado.contra = 1;
    }
    this.dialogRef.close(resultado);
  }

}
