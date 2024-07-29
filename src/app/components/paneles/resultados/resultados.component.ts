import { Component } from '@angular/core';
import { Consulta, ConsultasService, Votacion, VotacionesService } from '../../../../api';
import { PlenoExtraService } from '../../../services/pleno-extra.service';
import { GraficoComponent } from '../grafico/grafico.component';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    GraficoComponent
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent {

  idPleno: number = -1;
  consultas: Consulta[] = [];
  votaciones: Votacion[] = [];

  constructor(
    private votacionesService: VotacionesService,
    private consultasService: ConsultasService,
    private plenoExtraService: PlenoExtraService
  ) {}

  ngOnInit() {
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.loadResults();
    }
  }

  loadConsultas() {
    this.consultasService.consultasIdGet(this.idPleno).subscribe({
      next: (consultas: any) => {
        this.consultas = consultas.consultas;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadResults() {
    let puntos = this.plenoExtraService.getPuntosFromOrdenDia();
    
    puntos.forEach(punto => {
      punto.votacion;
      console.log(punto);
      
    });
  }

}
