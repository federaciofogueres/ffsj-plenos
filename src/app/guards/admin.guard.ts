import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "ffsj-web-components";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  async canActivate(): Promise<boolean> {
    let isAdmin: boolean = false;
    try {
        let cargos = this.authService.getCargos();
        isAdmin = cargos.some((cargo: any) => cargo.idCargo === 16);
    } catch (error) {
        console.error(error);
    }
    return isAdmin;
  }

}
