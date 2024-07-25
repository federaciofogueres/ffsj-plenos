import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
  })
export class PlenoExtraService {

    private idPleno = -1;

    constructor(
        private cookieService: CookieService
    ){
        this.loadPlenoFromCookies();
    }

    loadPlenoFromCookies() {
        this.idPleno = this.cookieService.get('idPleno') ? parseInt(this.cookieService.get('idPleno')) : -1;
    }

    getIdPleno(){
        return this.idPleno;
    }

}