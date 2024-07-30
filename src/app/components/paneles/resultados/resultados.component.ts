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
    FfsjSpinnerComponent
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

  votacionesResults = {
    votosTotales: 0,
    presentes: 0,
    opciones: []
  }

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

  showResults(votacion: Votacion) {
    console.log(votacion);
    this.getPresentes();
    this.getVotantes(votacion.id);
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
    const votantes = await firstValueFrom(this.votacionesService.votacionesIdGet(idVotacion));
    console.log(votantes);
    
  }


}
