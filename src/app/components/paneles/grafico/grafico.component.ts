//@ts-nocheck
import { CanvasJS } from "@canvasjs/angular-charts"
import { OpcionesRespuestaResult } from "src/api";
import { ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChildren, ViewEncapsulation, HostListener } from '@angular/core';

import { Subscription } from 'rxjs';

CanvasJS.addColorSet("futurShades",
[//colorSet Array
    "#0033A0",
    "#00C1D5",
    "#F1B434",
]);
@Component({
    selector: 'app-grafico',
    templateUrl: './grafico.component.html',
    styleUrls: ['./grafico.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GraficoComponent {

    fakeResult = [
        {
            "dia": "07",
            "preguntas": [
                {
                    "id": 1,
                    "titulo": "CALENDARIO DE ACTOS DE FOGUERES",
                    "votosTotales": 866,
                    "opcionesRespuesta": [
                        {
                            "idOpcion": 0,
                            "opcion": "A - Estudiar su modificación",
                            "votos": 744
                        },
                        {
                            "idOpcion": 1,
                            "opcion": "B - Dejarlo como está actualmente",
                            "votos": 122
                        }
                    ]
                },
                {
                    "id": 2,
                    "titulo": "EDAD CANDITADAS INFANTILES",
                    "votosTotales": 862,
                    "opcionesRespuesta": [
                        {
                            "idOpcion": 2,
                            "opcion": "A - 12",
                            "votos": 389
                        },
                        {
                            "idOpcion": 3,
                            "opcion": "B - 13",
                            "votos": 153
                        },
                        {
                            "idOpcion": 4,
                            "opcion": "C - Sin edad",
                            "votos": 320
                        }
                    ]
                },
                {
                    "id": 3,
                    "titulo": "PREMIOS DE PRESENTACIONES",
                    "votosTotales": 863,
                    "opcionesRespuesta": [
                        {
                            "idOpcion": 5,
                            "opcion": "A - Sí",
                            "votos": 149
                        },
                        {
                            "idOpcion": 6,
                            "opcion": "B - No",
                            "votos": 320
                        },
                        {
                            "idOpcion": 7,
                            "opcion": "C - No, pero con modificaciones",
                            "votos": 394
                        }
                    ]
                },
                {
                    "id": 4,
                    "titulo": "GABINETE TÉCNICO",
                    "votosTotales": 860,
                    "opcionesRespuesta": [
                        {
                            "idOpcion": 5,
                            "opcion": "A - Sí",
                            "votos": 835
                        },
                        {
                            "idOpcion": 8,
                            "opcion": "B - No, no es necesario",
                            "votos": 25
                        }
                    ]
                },
                {
                    "id": 5,
                    "titulo": "ESTATUTOS",
                    "votosTotales": 861,
                    "opcionesRespuesta": [
                        {
                            "idOpcion": 5,
                            "opcion": "A - Sí",
                            "votos": 840
                        },
                        {
                            "idOpcion": 6,
                            "opcion": "B - No",
                            "votos": 21
                        }
                    ]
                }
            ]
        }
    ]
    
    public innerWidth: any;
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.innerWidth = window.innerWidth;
      this.checkCss();
    }

    @ViewChildren('canvaId') canvaDiv!: QueryList<ElementRef>;
    private subscription!: Subscription;

    @Input()
    public respuestas!: OpcionesRespuestaResult[];

    @Input()
    public totalVotos!: number;

    chartOptions = {
        //theme: "light2",
        animationEnabled: true,
        colorSet: "futurShades",
        data: [{
            type: "pie",
            indexLabelWrap: true,
            indexLabelPlacement: 'inside',
            indexLabelMaxWidth: 100,
            indexLabelTextAlign: 'center',
            //radius: 400,
            indexLabel: "{label}{y}",
            yValueFormatString: "###0\"%\"",
            click: this.explodePie,
        }]
    }

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) {

    }

    ngAfterViewInit() {
        this.subscription = this.canvaDiv.changes.subscribe({
          next: () => {
            this.checkCss();
            this.changeDetectorRef.detectChanges();
          }
        })
      }

    ngOnInit() {
        this.innerWidth = window.innerWidth;
        this.loadOptions();
        this.checkCss();
    }

    checkCss() {
        setTimeout(() => {
            document.querySelector('.canva-graph')?.setAttribute('style', 'width: 100%; background-color: red; height: 100%;');
            document.querySelectorAll('.canvasjs-chart-credit').forEach(node => {
                node.remove();
            })
        }, 1);
    }

    explodePie(e: any) {
        for(var i = 0; i < e.dataSeries.dataPoints.length; i++) {
            if(i !== e.dataPointIndex)
                e.dataSeries.dataPoints[i].exploded = false;
        }
    }

    loadOptions(){
        if(this.respuestas){
            let indexMax = 0;
            let maxPercentaje = 0;
            let colors = ['#F1B434','#0033A0', '#00C1D5'];
            let index = 0;
            let fontSizeMax = 50;
            let fontSizeMin = 30;
            if(this.innerWidth < 768){
                fontSizeMax = 24;
                fontSizeMin = 16;
            } else if (this.innerWidth >= 768 && this.innerWidth < 1024) {
                fontSizeMax = 29;
                fontSizeMin = 23;
            } else if (this.innerWidth >= 1024 && this.innerWidth < 1920) {
                fontSizeMax = 36;
                fontSizeMin = 30;
            } else if (this.innerWidth >= 1920) {
                fontSizeMax = 53;
                fontSizeMin = 40;
            }
            //console.log(this.respuestas);
            this.totalVotos = 1578;
            //for(let respuesta of this.respuestas) {
            for(let respuesta of this.fakeResult) {
                if(respuesta.votos > 0){
                    let percentaje = respuesta.votos / this.totalVotos * 100;
                    let option: any = { 
                        y: percentaje, 
                        label: respuesta.opcion?.split('-')[0], 
                        indexLabelFontSize: fontSizeMin,
                        indexLabelFontColor: 'white',
                        indexLabelFontWeight: 'lighter',
                    }
                    
                    if(percentaje > maxPercentaje){
                        option.indexLabelFontWeight = 'bolder';
                        option.indexLabelFontSize = fontSizeMax;
                        //console.log(indexMax);
                        if(this.chartOptions.data[0]['dataPoints']) {
                            //console.log('thissss ->', indexMax, this.chartOptions.data[0].dataPoints);
                            //this.chartOptions.data[0].dataPoints[indexMax].indexLabelFontSize = 30;
                            //this.chartOptions.data[0].dataPoints[indexMax].indexLabelFontWeight = 'normal';
                        }
                        maxPercentaje = percentaje;
                        indexMax = index;
                    }
                    if(this.chartOptions.data[0]['dataPoints']) {
                        this.chartOptions.data[0].dataPoints.push(option);
                    } else {
                        this.chartOptions.data[0].dataPoints = [option];
                    }
                }
                index++;
            }
        }
    }
}



