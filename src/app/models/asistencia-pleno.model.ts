export interface AsistenciaPlenoFormattedModel {
    nombre: string;
    apellidos: string;
    nif: string;
    delegado: boolean;
    confirmadoPorUsuario: boolean;
    confirmadoPorSecretaria: boolean;
    id: number;
    autorizado?: boolean;
  }