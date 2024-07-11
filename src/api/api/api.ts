export * from './asistencia.service';
import { AsistenciaService } from './asistencia.service';
export * from './consultas.service';
import { ConsultasService } from './consultas.service';
export * from './documentos.service';
import { DocumentosService } from './documentos.service';
export * from './documentosPlenos.service';
import { DocumentosPlenosService } from './documentosPlenos.service';
export * from './informacionPuntoDelDia.service';
import { InformacionPuntoDelDiaService } from './informacionPuntoDelDia.service';
export * from './pleno.service';
import { PlenoService } from './pleno.service';
export * from './puntosOrdenDelDia.service';
import { PuntosOrdenDelDiaService } from './puntosOrdenDelDia.service';
export * from './votaciones.service';
import { VotacionesService } from './votaciones.service';
export const APIS = [AsistenciaService, ConsultasService, DocumentosService, DocumentosPlenosService, InformacionPuntoDelDiaService, PlenoService, PuntosOrdenDelDiaService, VotacionesService];
