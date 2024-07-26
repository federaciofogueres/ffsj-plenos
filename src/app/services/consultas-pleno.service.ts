import { Injectable } from "@angular/core";
import { ConsultasService } from "../../api";
import { Consulta } from "../../external-api/consulta";
import { ConsultasInfoService } from "./consultas.service";

@Injectable({
    providedIn: 'root'
})
export class ConsultasPlenoService {

    constructor(
        private consultasService: ConsultasService,
        private consultasInfoService: ConsultasInfoService
    ) { }

    public async getConsultasFromPlenoAsync(idPleno: number): Promise<Consulta[]> {
        let consultasGuardadas: Consulta[]= [];
        return new Promise((resolve, reject) => {
            this.consultasService.consultasIdGet(idPleno).subscribe({
              next: async (response: any) => {
                console.log(response);
                consultasGuardadas = [];
                const consultasPromises = response.consultas.map((consulta: any) => 
                  new Promise((resolveConsulta, rejectConsulta) => {
                    this.consultasInfoService.consultasIdGet(consulta.idConsulta).subscribe({
                      next: (responseConsulta: any) => {
                        console.log(responseConsulta);
                        consultasGuardadas.push(responseConsulta.consulta);
                        resolveConsulta(null); // Resuelve la promesa interna
                      },
                      error: (errorConsulta) => {
                        console.error(errorConsulta);
                        rejectConsulta(errorConsulta); // Rechaza la promesa interna
                      }
                    });
                  })
                );
        
                // Espera a que todas las promesas del array se resuelvan
                Promise.all(consultasPromises).then(() => {
                  resolve(consultasGuardadas); // Resuelve la promesa externa una vez que todas las consultas están cargadas
                }).catch((error) => {
                  console.error('Error loading consultas:', error);
                  reject(error); // Rechaza la promesa externa si alguna consulta falla
                });
              },
              error: (error) => {
                console.error(error);
                reject(error); // Rechaza la promesa externa si la llamada inicial falla
              }
            });
        });
    }
}