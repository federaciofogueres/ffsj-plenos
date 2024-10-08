import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FfsjSpinnerComponent } from 'ffsj-web-components';
import { CookieService } from 'ngx-cookie-service';
import { AsistenciaService, Pleno, PlenoService } from '../../../api';

@Component({
  selector: 'app-plenos',
  standalone: true,
  imports: [
    FfsjSpinnerComponent,
    CommonModule
  ],
  templateUrl: './plenos.component.html',
  styleUrl: './plenos.component.scss'
})
export class PlenosComponent {

  loading: boolean = false;
  mensajeError: string = '';
  idAsociado: number = -1;
  inactivePlenos: Pleno[] = [];
  activePlenos: Pleno[] = [];
  showPlenos: string = 'active';

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

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}h`;
  }

  isActivePleno(plenoDate: Date): boolean {
    const now = new Date();
    const twoHoursBefore = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    const fourHoursAfter = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    return plenoDate >= twoHoursBefore && plenoDate <= fourHoursAfter;
  }

  loadPlenos() {
    this.idAsociado = parseInt(this.cookieService.get('idUsuario'));
    this.asistenciaService.asistenciaIdGet(this.idAsociado).subscribe({
      next: async (response: any) => {
        console.log('Asistencia:', response);
        const plenosPromises = response.asistencias.map((asistencia: any) => 
          this.plenosService.plenoIdGet(asistencia.idPleno).toPromise().then((response: any) => {
            console.log('Pleno:', response);
            if (response.status.status === 200) {
              let pleno = response.plenos[0];
              let plenoFecha = new Date(pleno.fecha)
              plenoFecha.setHours(plenoFecha.getHours() - 2);
              pleno.fecha = this.formatDate(plenoFecha);
              if (!this.activePlenos.some(p => p.id === pleno.id) && !this.inactivePlenos.some(p => p.id === pleno.id)) {
                if (this.isActivePleno(plenoFecha)) {
                  this.activePlenos.push(pleno);
                } else {
                  this.inactivePlenos.push(pleno);
                }
              }
            }
          }).catch((error: any) => {
            console.log('Error:', error);
          })
        );
  
        await Promise.all(plenosPromises);

        // Ordenar los arrays por id
        this.activePlenos.sort((a, b) => a.id - b.id);
        this.inactivePlenos.sort((a, b) => a.id - b.id);

        this.cookieService.set('idAsociado', response.idAsociado);
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
