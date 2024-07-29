import { Injectable } from "@angular/core";
import { AuthService } from "ffsj-web-components";
import { jwtDecode } from 'jwt-decode';
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
  })
export class PlenoExtraService {

    private idPleno = -1;
    private idUsuario = -1;

    constructor(
        private cookieService: CookieService,
        private authService: AuthService
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

}