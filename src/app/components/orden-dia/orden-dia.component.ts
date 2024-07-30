import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FfsjAlertService } from 'ffsj-web-components';
import { Votacion, VotacionesService, Voto } from '../../../api';
import { OrdenDiaModel } from '../../models/orden-dia.model';
import { PlenoExtraService } from '../../services/pleno-extra.service';
import { VotacionDialogComponent } from '../dialogs/votacion-dialog/votacion-dialog.component';

@Component({
  selector: 'app-orden-dia',
  standalone: true,
  imports: [],
  templateUrl: './orden-dia.component.html',
  styleUrl: './orden-dia.component.scss'
})
export class OrdenDiaComponent {
  Boolean = Boolean;
  @Input() ordenDia: OrdenDiaModel = {
    titulo: '',
    firma: '',
    puntos: []
  };

  constructor(
    private dialog: MatDialog,
    private votacionesService: VotacionesService,
    private plenoExtraService: PlenoExtraService,
    private ffsjAlertService: FfsjAlertService
  ) {}

  ngOnInit() {
    console.log(this.ordenDia);
  }

  openVote(votacion: Votacion) {
    console.log('Votación:', votacion);
    const dialogRef = this.dialog.open(VotacionDialogComponent, {
      width: '99vw',
      data: { votacion: votacion },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      let voto: Voto = {
        favor: Boolean(result.favor),
        contra: Boolean(result.contra),
        blanco: Boolean(result.blanco),
        idAsociado: this.plenoExtraService.getIdUsuario()
      };
      result.favor = Boolean(result.favor);
      result.contra = Boolean(result.contra);
      result.blanco = Boolean(result.blanco);
      this.votacionesService.votacionesIdPost(voto, votacion.id).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status.status !== 200) {
            this.ffsjAlertService.danger('Error al registrar tu voto: ' + response.status.message);
            return;
          }
          votacion.favor = response.votaciones[0].favor;
          votacion.contra = response.votaciones[0].contra;
          votacion.blanco = response.votaciones[0].blanco;
          this.ffsjAlertService.success('Has votado ' + (result.favor ? 'a favor' : result.contra ? 'en contra' : 'en blanco') + ' correctamente');
        },
        error: (error) => {
          console.error(error);
          this.ffsjAlertService.danger('Error al registrar tu voto: ' + error.error);
          this.loadVotes(votacion.id);
        }
      });
      
    });
  }

  loadVotes(id: number) {
    this.votacionesService.votacionesIdGet(id).subscribe({
      next: (response) => {
        console.log(response);
        // this.ordenDia.puntos = this.ordenDia.puntos.map((p) => {
        //   p.votacion = response.find((v) => v.idPuntoOrdenDia === p.id);
        //   return p;
        // });
      },
      error: (error) => {
        console.error(error);
        this.ffsjAlertService.danger('Error al cargar las votaciones: ' + error.error.message);
      }
    })
  }

}
