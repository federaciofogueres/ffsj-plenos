import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { AsistenciaService, Pleno, PuntoOrdenDelDia, ResponseAsistencias } from '../../../api';
import { OrdenDiaModel } from '../../models/orden-dia.model';
import { PlenoExtraService } from '../../services/pleno-extra.service';
import { OrdenDiaComponent } from '../orden-dia/orden-dia.component';

@Component({
  selector: 'app-pleno',
  standalone: true,
  imports: [
    OrdenDiaComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './pleno.component.html',
  styleUrl: './pleno.component.scss'
})
export class PlenoComponent {
  idPleno: number = -1;
  token: string = '';
  pleno: Pleno = {
    id: 0,
    fecha: new Date("2024-07-30T00:00:00.000Z"),
    titulo: '',
    informacion_extra: '',
    firma: ''
  };
  puntos: PuntoOrdenDelDia[] = [];
  ordenDia: OrdenDiaModel = {
    titulo: '',
    firma: '',
    puntos: []
  }

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private asistenciaService: AsistenciaService,
    private router: Router,
    private plenoExtraService: PlenoExtraService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.idPleno = parseInt(this.route.snapshot.paramMap.get('idPleno')!);
    this.userCanEnter();
  }

  userCanEnter() {
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoGet(this.idPleno, this.plenoExtraService.getIdUsuario(this.token)).subscribe({
      next: (response: ResponseAsistencias) => {
        console.log(response);
        if (response.status.status === 200) {
          this.plenoExtraService.loadPlenoInfo().then((response) => {
            this.pleno = response.pleno;
            this.puntos = response.puntos;
            this.ordenDia = response.ordenDia;
          }).catch((error) => {
          }).finally(() => {
            this.loading = false;
          });
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('/home');
        console.log('Error:', error);
      }
    })
  }
  
}
