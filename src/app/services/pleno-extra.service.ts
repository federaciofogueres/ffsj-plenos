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
  puntos: PuntoOrdenDelDia[] = [];

  constructor(
      private cookieService: CookieService,
      private authService: AuthService,
      private plenoService: PlenoService,
      private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
  ){
      this.loadPlenoFromCookies();
  }

  loadPlenoFromCookies() {
      this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
  }

  getIdPleno(){
      return this.idPleno;
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

  loadPlenoInfo() {
    this.plenoService.plenoIdGet(this.idPleno).subscribe({
      next: (response: any) => {
        console.log(response);
        this.pleno = response.plenos[0];
        this.ordenDia.titulo = this.pleno.titulo;
        this.ordenDia.firma = this.pleno.firma;
        this.loadPuntosOrdenDelDia();
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    });
  }
  
  loadPuntosOrdenDelDia() {
    this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdGet(this.idPleno).subscribe({
      next: async (response: any) => {
        console.log(response);
        this.puntos = response.puntosOrdenDelDia;
        this.ordenDia.puntos = response.puntosOrdenDelDia.map((punto: PuntoOrdenDelDia) => ({
          id: punto.id,
          titulo: punto.titulo,
          texto: punto.texto,
          idPleno: punto.idPleno,
          expanded: false // Assuming you want to initialize all as not expanded
        }));
        for(let punto of this.ordenDia.puntos) {
          await this.loadInfoFromPunto(punto);
          console.log(punto);
        }
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    
    });
  }
  
    async loadInfoFromPunto(punto: PuntoOrdenDiaModel) {
      await this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdVotacionesGet(punto.id)
        .toPromise()
        .then((response: any) => { // Paso 2: Usar await con toPromise()
          if (response.status.status === 200) {
            punto.votacion = response.votaciones;
          }
          console.log(response);
        }).catch((error: any) => {
          console.log('Error:', error);
        });
      await this.puntosOrdenDelDiaService.puntosOrdenDelDiaIdDocumentosGet(punto.id)
        .toPromise()
        .then((response: any) => {
          if (response.status.status === 200) {
            punto.documentacion = response.documentos;
          }
          console.log(response);
        }).catch((error: any) => {
          console.log('Error:', error);
        });
    }

}