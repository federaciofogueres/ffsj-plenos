import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AsistenciaService } from './api/asistencia.service';
import { ConsultasService } from './api/consultas.service';
import { DocumentosService } from './api/documentos.service';
import { DocumentosPlenosService } from './api/documentosPlenos.service';
import { InformacionPuntoDelDiaService } from './api/informacionPuntoDelDia.service';
import { PlenoService } from './api/pleno.service';
import { PuntosOrdenDelDiaService } from './api/puntosOrdenDelDia.service';
import { VotacionesService } from './api/votaciones.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AsistenciaService,
    ConsultasService,
    DocumentosService,
    DocumentosPlenosService,
    InformacionPuntoDelDiaService,
    PlenoService,
    PuntosOrdenDelDiaService,
    VotacionesService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
