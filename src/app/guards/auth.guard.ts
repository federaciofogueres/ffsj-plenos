import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "ffsj-web-components";
import { AsistenciaService, ConsultasService, DocumentosPlenosService, DocumentosService, InformacionPuntoDelDiaService, PlenoService, PuntosOrdenDelDiaService, VotacionesService } from "../../api";
import { CensoService } from "../services/censo.service";
import { ConsultasInfoService } from "../services/consultas.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private plenoService: PlenoService,
    private asistenciaService: AsistenciaService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    private documentosService: DocumentosService,
    private documentosPlenosService: DocumentosPlenosService,
    private votacionesService: VotacionesService,
    private consultasService: ConsultasService,
    private consultasInfoService: ConsultasInfoService,
    private informacionPuntoDelDiaService: InformacionPuntoDelDiaService,
    private censoService: CensoService
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()){
      let token = this.authService.getToken();
      this.plenoService.configuration.accessToken = token;
      this.asistenciaService.configuration.accessToken = token;
      this.puntosOrdenDelDiaService.configuration.accessToken = token;
      this.documentosService.configuration.accessToken = token;
      this.votacionesService.configuration.accessToken = token;
      this.documentosPlenosService.configuration.accessToken = token;
      this.consultasService.configuration.accessToken = token;
      this.consultasInfoService.configuration.accessToken = token;
      this.informacionPuntoDelDiaService.configuration.accessToken = token;
      this.censoService.configuration.accessToken = token;
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
