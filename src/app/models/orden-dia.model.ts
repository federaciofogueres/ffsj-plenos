export interface OrdenDiaModel {
    titulo: string;
    firma: string;
    puntos: PuntoOrdenDiaModel[];
}

export interface PuntoOrdenDiaModel {
    id: number;
    titulo: string;
    texto?: string;
    votacion?: ResultadoModel;
    documentacion: boolean;
    expanded: boolean;
}

export interface ResultadoModel {
    votosAFavor: number;
    votosEnContra: number;
    abstenciones: number;
    votosNulos: number | undefined;
    votosBlanco: number;
}
