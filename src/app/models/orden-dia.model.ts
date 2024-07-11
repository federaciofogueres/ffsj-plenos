import { Documento, Votacion } from "../../api";

export interface OrdenDiaModel {
    titulo: string;
    firma: string;
    puntos: PuntoOrdenDiaModel[];
}

export interface PuntoOrdenDiaModel {
    id: number;
    titulo: string;
    texto?: string;
    votacion?: Votacion[];
    documentacion: Documento[];
    expanded: boolean;
    idPleno: number;
}

