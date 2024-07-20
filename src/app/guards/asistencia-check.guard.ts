import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { FfsjAlertService } from "ffsj-web-components";
import { CookieService } from "ngx-cookie-service";
import { AsistenciaService } from "../../api";

@Injectable({
  providedIn: 'root'
})
export class AsistenciaCheckGuard implements CanActivate {

  constructor(
    private asistenciaService: AsistenciaService,
    private cookieService: CookieService,
    private alertService: FfsjAlertService
  ) {}

  async canActivate(): Promise<boolean> {
    let asistenciaChecked: boolean = false;
    const idPleno = parseInt(this.cookieService.get('idPleno'));
    const idUsuario = parseInt(this.cookieService.get('idUsuario'));
    
    await new Promise<void>((resolve) => {
      this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoGet(idPleno, idUsuario).subscribe({
        next: (response: any) => {
            if (response.status.status === 200) {
                if (response.asistencias[0].asistenciaConfirmadaPorSecretaria === 1 && response.asistencias[0].asistenciaConfirmada === 1) {
                    asistenciaChecked = true;
                }
            }
            resolve();
        },
        error: () => resolve()
      });
    });

    if (!asistenciaChecked) {
        this.alertService.warning('No puedes acceder a esta página hasta que no confirmes tu asistencia. Contacta con secretaría para que confirmen tu asistencia.');
    }
    return asistenciaChecked;
  }

}
