import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FfsjLoginComponent } from 'ffsj-web-components';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { AsistenciaService, ConsultasService, DocumentosPlenosService, DocumentosService, PlenoService, PuntosOrdenDelDiaService, ResponseAsistencias, VotacionesService } from '../../../api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FfsjLoginComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private asistenciaService: AsistenciaService,
    private consultasService: ConsultasService,
    private documentosService: DocumentosService,
    private documentosPlenosService: DocumentosPlenosService,
    private plenosService: PlenoService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    private votaciones: VotacionesService,
    private authService: AuthService,
    private cookiesService: CookieService
  ) {}

  manageLogin(event: any) {
    console.log('Login event:', event);
    if (event) {
      console.log('Login successful');

      let token = this.authService.getToken();
      this.getIdUsuario(token);
      this.setTokenConfigurations(token);

      this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoGet(0, this.getIdUsuario(token)).subscribe({
        next: (response: ResponseAsistencias) => {
          console.log(response);
          if (response.status.status === 200) {
            this.router.navigateByUrl('/home');
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
        }
      })
      
    } else {
      console.log('Login failed');
    }
  }

  getIdUsuario(token: string) {
    const decodedToken: any = jwtDecode(token);
    this.cookiesService.set('idUsuario', decodedToken.id);
    return decodedToken.id;
  }

  setTokenConfigurations(token: string) {
    this.asistenciaService.configuration.accessToken = token;
    this.consultasService.configuration.accessToken = token;
    this.documentosService.configuration.accessToken = token;
    this.documentosPlenosService.configuration.accessToken = token;
    this.plenosService.configuration.accessToken = token;
    this.puntosOrdenDelDiaService.configuration.accessToken = token;
    this.votaciones.configuration.accessToken = token;
  }

}
