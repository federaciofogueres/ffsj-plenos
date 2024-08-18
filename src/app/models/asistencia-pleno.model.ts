export interface AsistenciaPlenoFormattedModel {
    nombre: string;
    apellidos: string;
    nif: string;
    delegado: boolean;
    confirmadoPorUsuario: boolean;
    confirmadoPorSecretaria: boolean;
    idAsociado: number;
    idAsistencia: number;
    idCargo: number;
    idAsociacion: number;
    autorizado?: boolean;
    isExpanded?: boolean;
  }