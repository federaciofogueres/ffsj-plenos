import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { AsistenciaService, Pleno, PlenoService } from '../../../api';

@Component({
  selector: 'app-plenos',
  standalone: true,
  imports: [
    FfsjSpinnerComponent
  ],
  templateUrl: './plenos.component.html',
  styleUrl: './plenos.component.scss'
})
export class PlenosComponent {

  plenos: Pleno[] = [];
  loading: boolean = false;
  mensajeError: string = '';
  idAsociado: number = -1;

  @Input() seleccionaPleno: boolean = false;
  @Output() plenoSeleccionado = new EventEmitter<number>();

  constructor(
    private plenosService: PlenoService,
    private asistenciaService: AsistenciaService,
    protected route: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loadPlenos();
  }

  loadPlenos() {
    this.idAsociado = parseInt(this.cookieService.get('idUsuario'));
    this.asistenciaService.asistenciaIdGet(this.idAsociado).subscribe({
      next: async (response: any) => { // Añadir async aquí
        console.log('Asistencia:', response);
        const plenosPromises = response.asistencias.map((asistencia: any) => 
          this.plenosService.plenoIdGet(asistencia.idPleno).toPromise().then((response: any) => {
            console.log('Pleno:', response);
            if (response.status.status === 200) {
              this.plenos.push(response.plenos[0]);
            }
          }).catch((error: any) => {
            console.log('Error:', error);
          })
        );
  
        await Promise.all(plenosPromises); // Esperar a que todas las promesas se resuelvan
        this.loading = false; // Mover esta línea aquí
        //TO-DO: Revisar esto
        this.cookieService.set('idAsociado', response.idAsociado);
      },
      error: (error: any) => {
        console.log('Error:', error);
        this.mensajeError = error.error.message;
        this.loading = false;
      }
    });
  }

  gestionaPleno(idPleno: number) {
    if (!this.seleccionaPleno) {
      this.cookieService.set('idPleno', idPleno.toString());
      this.route.navigate(['/plenos', idPleno]);
    } else {
      this.plenoSeleccionado.emit(idPleno);
    }
  }

}
