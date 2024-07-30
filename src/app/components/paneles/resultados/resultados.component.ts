import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { firstValueFrom } from 'rxjs';
import { AsistenciaService, ConsultasService, Votacion, VotacionesService } from '../../../../api';
import { Consulta } from '../../../../external-api/consulta';
import { ResultadoPregunta } from '../../../../external-api/resultadoPregunta';
import { PuntoOrdenDiaModel } from '../../../models/orden-dia.model';
import { ConsultasInfoService } from '../../../services/consultas.service';
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

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  colores = [
    '#FF5733', // Rojo
    '#33FF57', // Verde
    '#3357FF', // Azul
    '#FF33A1', // Rosa
    '#FF8C33', // Naranja
    '#33FFF5', // Cian
    '#8D33FF', // Púrpura
    '#FFD433', // Amarillo
    '#33FF8C', // Verde claro
    '#FF3333', // Rojo oscuro
    '#33A1FF', // Azul claro
    '#FF33D4', // Magenta
    '#FFC300', // Amarillo oscuro (alternativa al rojo)
    '#DAF7A6', // Verde pálido (alternativa al verde)
    '#900C3F'  // Vino (alternativa al azul)
  ];

  loading: boolean = false;
  showChart: boolean = false;

  selectedOption: string = '';
  selectedVotacion: number = -1;
  selectedConsulta: number = -1;

  idOpcion = 0;
  idPleno: number = -1;
  consultas: Consulta[] = [];
  votaciones: Votacion[] = [];
  resultadosVotaciones: OpcionesRespuestaResult[] = [];
  votosTotales: number = 0;
  presentes: number = 0;

  @Input() puntos: PuntoOrdenDiaModel[] = [];

  chartsData: any[] = []; // Array para almacenar los datos de múltiples gráficos

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
    private asistenciaService: AsistenciaService,
    private consultasInfoService: ConsultasInfoService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loading = true;
    this.idPleno = this.plenoExtraService.getIdPleno();
    if (this.idPleno !== -1) {
      this.getPresentes();
      this.loadResults();
      this.loadConsultas();
    }
  }

  loadConsultas() {
    this.consultasService.consultasIdGet(this.idPleno).subscribe({
      next: (consultas: any) => {
        console.log(consultas);
        for (let consulta of consultas.consultas) {
          this.consultasInfoService.consultasIdGet(consulta.idConsulta).subscribe({
            next: (consultaInfo: any) => {
              console.log(consultaInfo);
              if (consultaInfo.status.status === 200) {
                this.consultas.push(consultaInfo.consulta);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
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
    this.selectedVotacion = votacion.id;
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

  loadResultsFromConsulta(consulta: Consulta) {
    this.chartsData = [];
    this.consultasInfoService.consultasIdResultadosGet(consulta.id).subscribe({
      next: (resultados: any) => {
        console.log(resultados);
        if (resultados.status.status === 200) {
          this.selectedConsulta = consulta.id;
          this.showChart = true;
          for(let pregunta of resultados.resultadoConsulta.resultadoPreguntas) {
            this.prepareChart(pregunta);
          }
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  prepareChart(pregunta: ResultadoPregunta) {
    this.chartData.labels = [];
    this.chartData.datasets = [];
    this.chartData.labels.push(`${pregunta.titulo}`);
    this.votosTotales = 0;
    for (let i = 0; i < pregunta.resultadoOpciones!.length; i++) {
      let resultado = pregunta.resultadoOpciones![i];
      this.votosTotales += resultado.votos;
      this.chartData.datasets.push(
          { label: resultado.respuesta, data: [resultado.votos], backgroundColor: this.colores[i] },
      );
  }
    this.renderChart(this.chartData);
  }

  showConsulta(consulta: Consulta){
    this.selectedConsulta = consulta.id;
    this.loadResultsFromConsulta(consulta);
  }

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

  selectOption(opcion: any): void {
    this.selectedOption = opcion.opcion;
    this.showVotes = opcion.votantes;
  }

}
