import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FfsjSpinnerComponent } from 'ffsj-web-components';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AsistenciaService, DocumentosPlenosService, Pleno, PlenoService, PuntoOrdenDelDia, PuntosOrdenDelDiaService, ResponseAsistencias, VotacionesService } from '../../../api';
import { OrdenDiaModel } from '../../models/orden-dia.model';
import { OrdenDiaComponent } from '../orden-dia/orden-dia.component';

@Component({
  selector: 'app-pleno',
  standalone: true,
  imports: [
    OrdenDiaComponent,
    FfsjSpinnerComponent
  ],
  templateUrl: './pleno.component.html',
  styleUrl: './pleno.component.scss'
})
export class PlenoComponent {
  idPleno: number = -1;
  token: string = '';
  pleno: Pleno = {
    id: 0,
    fecha: new Date("2024-07-30T00:00:00.000Z"),
    titulo: '',
    informacionExtra: '',
    firma: ''
  };
  puntos: PuntoOrdenDelDia[] = [];
  ordenDia: OrdenDiaModel = {
    titulo: '',
    firma: '',
    puntos: []
  }

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private plenoService: PlenoService,
    private asistenciaService: AsistenciaService,
    private puntosOrdenDelDiaService: PuntosOrdenDelDiaService,
    private documentosService: DocumentosPlenosService,
    private votacionesService: VotacionesService,
    private cookiesService: CookieService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.idPleno = parseInt(this.route.snapshot.paramMap.get('idPleno')!);
    this.loadToken();
    this.userCanEnter();
  }

  loadToken() {
    this.token = this.authService.getToken();
    this.asistenciaService.configuration.accessToken = this.token;
    this.plenoService.configuration.accessToken = this.token;
    this.puntosOrdenDelDiaService.configuration.accessToken = this.token;
    this.documentosService.configuration.accessToken = this.token;
    this.votacionesService.configuration.accessToken = this.token;
  }

  userCanEnter() {
    this.asistenciaService.asistenciaIdPlenoAsociadosIdAsociadoGet(this.idPleno, this.getIdUsuario(this.token)).subscribe({
      next: (response: ResponseAsistencias) => {
        console.log(response);
        if (response.status.status === 200) {
          this.loadPlenoInfo();
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('/home');
        console.log('Error:', error);
      }
    })
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
      next: (response: any) => {
        console.log(response);
        this.puntos = response.puntosOrdenDelDia;
        this.ordenDia.puntos = this.puntos;
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    
    });
  }

  loadDocumentos() {
    this.documentosService.documentosPlenosIdGet(this.idPleno).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    });
  }

  loadVotaciones() { 
    this.votacionesService.votacionesIdGet(this.idPleno).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Error:', error);
      }
    });
  }

  getIdUsuario(token: string) {
    const decodedToken: any = jwtDecode(token);
    this.cookiesService.set('idUsuario', decodedToken.id);
    return decodedToken.id;
  }
  
}
