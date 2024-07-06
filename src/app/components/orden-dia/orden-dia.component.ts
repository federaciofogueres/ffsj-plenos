import { Component } from '@angular/core';
import { OrdenDiaModel } from '../../models/orden-dia.model';

@Component({
  selector: 'app-orden-dia',
  standalone: true,
  imports: [],
  templateUrl: './orden-dia.component.html',
  styleUrl: './orden-dia.component.scss'
})
export class OrdenDiaComponent {
  Boolean = Boolean;
  ordenDia: OrdenDiaModel = {
    titulo: 'Pleno del 30 de julio de 2024',
    firma: 'Raquel Pastor Aguilar, Secretaria General de la Federació de les Fogueres de Sant Joan',
    puntos: [
      {
        id: 0,
        titulo: 'Lectura y aprobación, si procede, del acta de la sesión anterior',
        votacion: {
          votosAFavor: 0,
          votosEnContra: 0,
          abstenciones: 0,
          votosNulos: undefined,
          votosBlanco: 0
        },
        documentacion: true,
        expanded: false
      },
      {
        id: 1,
        titulo: 'Informe de Presidencia',
        documentacion: false,
        expanded: false
      },
      {
        id: 2,
        titulo: 'Elección foguera ejemplar 2024',
        documentacion: false,
        expanded: false
      },
      {
        id: 3,
        titulo: 'Elección foguera ejemplar infantil 2024',
        documentacion: false,
        expanded: false
      },
      {
        id: 4,
        titulo: 'Elección barraca ejemplar 2024',
        documentacion: false,
        expanded: false
      },
      {
        id: 5,
        titulo: 'Ruegos y preguntas',
        documentacion: false,
        expanded: false
      }
    ]
  };
}
