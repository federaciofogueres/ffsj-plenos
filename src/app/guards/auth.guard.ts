import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "ffsj-web-components";
import { AsistenciaService, DocumentosPlenosService, DocumentosService, PlenoService, PuntosOrdenDelDiaService, VotacionesService } from "../../api";

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
    private votacionesService: VotacionesService
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
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
