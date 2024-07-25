import { Injectable } from '@angular/core';
import { FfsjAlertService } from 'ffsj-web-components';
import { firstValueFrom } from 'rxjs';
import { AsistenciaService } from '../../api';
import { CensoService } from './censo.service';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaPlenoService {
  constructor(
    private asistenciaService: AsistenciaService, // Asumiendo que este es el servicio existente
    private censoService: CensoService, // Asumiendo que este es el servicio existente
    private ffsjAlertService: FfsjAlertService // Asumiendo que este es el servicio existente
  ) {}

  async loadAsistencia(idPleno: number): Promise<any> {
    try {
      const data = await firstValueFrom(this.asistenciaService.plenosIdPlenoAsistenciaGet(idPleno));
      if (data.status.status === 200 && data.asistencias.length > 0) {
        const asistenciasPromises = data.asistencias.map(async (asistencia) => {
          const response = await firstValueFrom(this.censoService.asociadosGetById(asistencia.idAsociado));
          if (response && response.status && response.status.status !== 200) {
            throw new Error('Error al cargar la asistencia: ' + response.status.message);
          }
          const asociado = response.asociados && response.asociados[0];
          if (!asociado) {
            throw new Error('Error al cargar la asistencia: No se encontró el asociado');
          }
          return {
            nombre: asociado.nombre,
            apellidos: asociado.apellidos,
            nif: asociado.nif,
            delegado: asistencia.delegado,
            confirmadoPorUsuario: asistencia.asistenciaConfirmada,
            confirmadoPorSecretaria: asistencia.asistenciaConfirmadaPorSecretaria,
            id: asociado.id
          };
        });
        return await Promise.all(asistenciasPromises);
      } else {
        this.ffsjAlertService.warning('No hay asistencias disponibles para este pleno');
        return [];
      }
    } catch (error) {
      throw new Error('Error al cargar las asistencias: ' + error);
    }
  }
  
}