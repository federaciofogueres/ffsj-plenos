import { Injectable } from "@angular/core";
import { AuthService } from "ffsj-web-components";
import { jwtDecode } from 'jwt-decode';
import { CookieService } from "ngx-cookie-service";
import { Pleno, PlenoService, PuntoOrdenDelDia, PuntosOrdenDelDiaService } from "../../api";
import { OrdenDiaModel, PuntoOrdenDiaModel } from "../models/orden-dia.model";

@Injectable({
    providedIn: 'root'
})
export class PlenoExtraService {

    private idPleno = -1;
    private idUsuario = -1;
    private asistenciasUsuario: number[] = [];
    private ordenDia: OrdenDiaModel = {
        titulo: '',
        firma: '',
        puntos: []
    }
    private pleno: Pleno = {
      id: 0,
      fecha: new Date("2024-07-30T00:00:00.000Z"),
      titulo: '',
      informacion_extra: '',
      firma: ''
    };
    private puntos: PuntoOrdenDelDia[] = [];

    constructor(
        private cookieService: CookieService,
        private authService: AuthService,
        private plenoService: PlenoService,
        private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    ) {
        this.loadPlenoFromCookies();
    }

    private loadPlenoFromCookies() {
        this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
    }

    getPuntosFromOrdenDia() {
        return this.ordenDia.puntos;
    }

    getIdPleno() {
        return this.idPleno;
    }

    setAsistencias(asistencias: number[]) {
        this.asistenciasUsuario = asistencias;
        this.cookieService.set('asistencias', JSON.stringify(asistencias));
    }

    getAsistencias() {
        return this.asistenciasUsuario.length > 0 ? this.asistenciasUsuario : JSON.parse(this.cookieService.get('asistencias'));
    }

    getIdUsuario(token?: string) {
        if (this.idUsuario !== -1) {
            return this.idUsuario;
        }
        if (!token) {
            token = this.authService.getToken();
        }
        const decodedToken: any = jwtDecode(token);
        this.cookieService.set('idUsuario', decodedToken.id);
        this.idUsuario = decodedToken.id;
        return decodedToken.id;
    }

    async loadPlenoInfo(): Promise<{ pleno: Pleno, ordenDia: OrdenDiaModel, puntos: PuntoOrdenDelDia[] }> {
        this.loadPlenoFromCookies();
        try {
            const plenoResponse: any = await this.plenoService.plenoIdGet(this.idPleno).toPromise();
            this.pleno = plenoResponse!.plenos[0];
            this.ordenDia.titulo = this.pleno.titulo;
            this.ordenDia.firma = this.pleno.firma;

            const puntosResponse: any = await this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(this.idPleno).toPromise();
            this.puntos = puntosResponse!.puntosOrdenDelDia;
            this.ordenDia.puntos = puntosResponse!.puntosOrdenDelDia.map((punto: PuntoOrdenDelDia) => ({
                id: punto.id,
                titulo: punto.titulo,
                texto: punto.texto,
                idPleno: punto.idPleno,
                expanded: false,
                documentacion: [] // Add the 'documentacion' property with an empty array
            }));

            await this.loadAllInfoFromPuntos(this.ordenDia.puntos);

            return { pleno: this.pleno, ordenDia: this.ordenDia, puntos: this.puntos };
        } catch (error) {
            console.log('Error:', error);
        }
        return { pleno: this.pleno, ordenDia: this.ordenDia, puntos: this.puntos };
    }

    private async loadAllInfoFromPuntos(puntos: PuntoOrdenDiaModel[]) {
        for (let punto of puntos) {
            await this.loadInfoFromPunto(punto);
            console.log(punto);
        }
    }

    private async loadInfoFromPunto(punto: PuntoOrdenDiaModel) {
        try {
            const votacionesResponse = await this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdVotacionesGet(punto.id).toPromise();
            if (votacionesResponse!.status.status === 200) {
                punto.votacion = votacionesResponse!.votaciones;
            }
            console.log(votacionesResponse);

            const documentosResponse = await this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(punto.id).toPromise();
            if (documentosResponse!.status.status === 200) {
                punto.documentacion = documentosResponse!.documentos;
            }
            console.log(documentosResponse);
        } catch (error) {
            console.log('Error:', error);
        }
    }
}