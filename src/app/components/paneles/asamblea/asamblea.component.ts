import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { Pleno, PuntoOrdenDelDia } from '../../../../api';
import { OrdenDiaModel } from '../../../models/orden-dia.model';
import { PlenoExtraService } from '../../../services/pleno-extra.service';
import { OrdenDiaComponent } from '../../orden-dia/orden-dia.component';
import { PlenosComponent } from '../../plenos/plenos.component';

@Component({
  selector: 'app-asamblea',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    PlenosComponent,
    OrdenDiaComponent
  ],
  templateUrl: './asamblea.component.html',
  styleUrl: './asamblea.component.scss'
})
export class AsambleaComponent {

  loading: boolean = false;
  idPleno: number = -1;
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

  constructor(
    private plenoExtraService: PlenoExtraService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loadPleno();
  } 

  loadPleno() {
    this.idPleno = this.plenoExtraService.getIdPleno();
    this.plenoExtraService.loadPlenoInfo().then((response) => {
      console.log(response);
      this.pleno = response.pleno;
      this.puntos = response.puntos;
      this.ordenDia = response.ordenDia;
      
    });
    this.loading = false;
  }

  plenoSeleccionado(idPleno: number) {
    this.idPleno = idPleno;
  }

}