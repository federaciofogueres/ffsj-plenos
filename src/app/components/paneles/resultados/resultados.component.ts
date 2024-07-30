import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { firstValueFrom } from 'rxjs';
import { AsistenciaService, Consulta, ConsultasService, Votacion, VotacionesService } from '../../../../api';
import { PuntoOrdenDiaModel } from '../../../models/orden-dia.model';
import { PlenoExtraService } from '../../../services/pleno-extra.service';
import { GraficoComponent } from '../grafico/grafico.component';

export interface VotacionResult {
  votacionTitulo: string;
  votacionId: number;
  votosTotales: number;
  opciones: OpcionesRespuestaResult[];
}

export interface OpcionesRespuestaResult {
  idOpcion: string;
  opcion: string;
  votos: number;
  votantes: any[];
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    GraficoComponent,
    FfsjSpinnerComponent,
    CommonModule
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent {

  loading: boolean = false;
  showChart: boolean = false;

  idOpcion = 0;
  idPleno: number = -1;
  consultas: Consulta[] = [];
  votaciones: Votacion[] = [];
  resultadosVotaciones: OpcionesRespuestaResult[] = [];
  votosTotales: number = 0;
  presentes: number = 0;

  @Input() puntos: PuntoOrdenDiaModel[] = [];

  votacionesResults: VotacionResult = {
    votosTotales: 0,
    opciones: [],
    votacionTitulo: '',
    votacionId: 0
  }

  showVotes: any[] = [];

  chart: Chart | undefined;
  chartData: any = {
    labels: [],
    datasets: []
  };

  constructor(
    private votacionesService: VotacionesService,
    private consultasService: ConsultasService,
    private plenoExtraService: PlenoExtraService,
    private asistenciaService: AsistenciaService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loading = true;
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
    if (!this.puntos || this.puntos.length === 0) {
      this.plenoExtraService.loadPlenoInfo();
      this.puntos = this.plenoExtraService.getPuntosFromOrdenDia();
    }
    for (let punto of this.puntos) {
      punto.votacion?.forEach(votacion => {
        this.votaciones.push(votacion);
      })
    }
    console.log(this.votaciones);
    this.loading = false;
    
  }

  agruparVotantesPorIdAsociacion(votantes: any[]): any {
    const agrupados: any = {};
    votantes.forEach((votante: any) => {
      const idAsociacion = votante.idAsociacion;
      if (!agrupados[idAsociacion]) {
        agrupados[idAsociacion] = [];
      }
      agrupados[idAsociacion].push(votante);
    });
    return agrupados;
  }

  async loadResultFromVotacion(votacion: Votacion) {
    this.getPresentes();
    const votantes: any = await this.getVotantes(votacion.id);
    this.votacionesResults.votacionTitulo = votacion.infoExtra;
    this.votacionesResults.votacionId = votacion.id;
    this.votacionesResults.votosTotales = votacion.favor + votacion.contra + votacion.blanco;
    if (votantes.status.status === 200) {
      this.votacionesResults.opciones = [];
      const keys = Object.keys(votantes.votantes);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let opcion: OpcionesRespuestaResult = {
          idOpcion: i.toString(),
          opcion: key,
          votos: votantes.votantes[key].length,
          votantes: this.agruparVotantesPorIdAsociacion(votantes.votantes[key])
        }
        this.votacionesResults.opciones.push(opcion);
      }
    }
  }

  showResults(votacion: Votacion) {
    console.log(votacion);
    this.loadResultFromVotacion(votacion);
    this.showChart = true;
    this.chartData.labels = [];
    this.chartData.datasets = [];
    this.chartData.labels.push(`${votacion.infoExtra}`);
    this.chartData.datasets.push(
      { label: 'A favor', data: [votacion.favor], backgroundColor: 'green' },
    );
    this.chartData.datasets.push(
      { label: 'En contra', data: [votacion.contra], backgroundColor: 'red' },
    );
    this.chartData.datasets.push(
      { label: 'En blanco', data: [votacion.blanco], backgroundColor: 'gray' },
    );
    this.votosTotales = votacion.favor + votacion.contra + votacion.blanco;
    this.renderChart(this.chartData);
  }

  // parseResultsVotaciones(texto: string, votos: number) {
  //   let result: OpcionesRespuestaResult = {
  //     idOpcion: this.idOpcion.toString(),
  //     opcion: texto,
  //     votos: votos
  //   };
  //   this.idOpcion++;
  //   return result;
  // }

  renderChart(data: any) {
    const ctx = document.getElementById('resultsChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  }

  async getPresentes() {
    const asistentes = await firstValueFrom(this.asistenciaService.plenosIdPlenoAsistenciaGet(this.idPleno));
    this.presentes = asistentes.asistencias.filter(a => a.asistenciaConfirmadaPorSecretaria).length;
  }

  async getVotantes(idVotacion: number) {
    return await firstValueFrom(this.votacionesService.votacionesIdVotantesGet(idVotacion));
  }

}
