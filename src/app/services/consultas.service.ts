/**
 * Consultas API
 * API para gestionar consultas de usuarios.
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

 import {
    HttpClient,
    HttpEvent,
    HttpHeaders,
    HttpResponse
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { BASE_PATH, Configuration, ResponseConsultas } from '../../api';
import { Autorizacion } from '../../external-api/autorizacion';
import { ResponseAutorizacion } from '../../external-api/responseAutorizacion';
import { ResponseAutorizaciones } from '../../external-api/responseAutorizaciones';
import { ResponseConsulta } from '../../external-api/responseConsulta';
import { ResponseStatus } from '../../external-api/responseStatus';
import { ResultadoConsulta } from '../../external-api/resultadoConsulta';



@Injectable({providedIn: 'root'})
export class ConsultasInfoService {

    protected basePath = 'https://ffsj-consultas-api.azurewebsites.net/FFSJ/APP-Plenos/1.0.0';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * Obtener una consulta por ID
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public consultasIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseConsulta>;
    public consultasIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseConsulta>>;
    public consultasIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseConsulta>>;
    public consultasIdGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling consultasIdGet.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header

        return this.httpClient.request<ResponseConsulta>('get',`${this.basePath}/consultas/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Obtener todas las consultas
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
        public consultasGet(observe?: 'body', reportProgress?: boolean): Observable<ResponseConsultas>;
        public consultasGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseConsultas>>;
        public consultasGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseConsultas>>;
        public consultasGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
    
            let headers = this.defaultHeaders;
    
            // authentication (bearerAuth) required
            if (this.configuration.accessToken) {
                const accessToken = typeof this.configuration.accessToken === 'function'
                    ? this.configuration.accessToken()
                    : this.configuration.accessToken;
                headers = headers.set('Authorization', 'Bearer ' + accessToken);
            }
            // to determine the Accept header
            let httpHeaderAccepts: string[] = [
                'application/json'
            ];
            const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
            if (httpHeaderAcceptSelected != undefined) {
                headers = headers.set('Accept', httpHeaderAcceptSelected);
            }
    
            // to determine the Content-Type header
    
            return this.httpClient.request<ResponseConsultas>('get',`${this.basePath}/consultas`,
                {
                    withCredentials: this.configuration.withCredentials,
                    headers: headers,
                    observe: observe,
                    reportProgress: reportProgress
                }
            );
        }

    /**
     * Obtener todas las autorizaciones de una consulta
     * 
     * @param idConsulta 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public consultasIdConsultaAutorizadosGet(idConsulta: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseAutorizaciones>;
    public consultasIdConsultaAutorizadosGet(idConsulta: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseAutorizaciones>>;
    public consultasIdConsultaAutorizadosGet(idConsulta: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseAutorizaciones>>;
    public consultasIdConsultaAutorizadosGet(idConsulta: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (idConsulta === null || idConsulta === undefined) {
            throw new Error('Required parameter idConsulta was null or undefined when calling consultasIdConsultaAutorizadosGet.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ResponseAutorizaciones>('get',`${this.basePath}/consultas/${encodeURIComponent(String(idConsulta))}/autorizados`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Crear una nueva autorización
     * 
     * @param body 
     * @param idConsulta 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
        public consultasIdConsultaAutorizadosPost(body: Autorizacion, idConsulta: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseStatus>;
        public consultasIdConsultaAutorizadosPost(body: Autorizacion, idConsulta: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseStatus>>;
        public consultasIdConsultaAutorizadosPost(body: Autorizacion, idConsulta: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseStatus>>;
        public consultasIdConsultaAutorizadosPost(body: Autorizacion, idConsulta: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
    
            if (body === null || body === undefined) {
                throw new Error('Required parameter body was null or undefined when calling consultasIdConsultaAutorizadosPost.');
            }
    
            if (idConsulta === null || idConsulta === undefined) {
                throw new Error('Required parameter idConsulta was null or undefined when calling consultasIdConsultaAutorizadosPost.');
            }
    
            let headers = this.defaultHeaders;
    
            // authentication (bearerAuth) required
            if (this.configuration.accessToken) {
                const accessToken = typeof this.configuration.accessToken === 'function'
                    ? this.configuration.accessToken()
                    : this.configuration.accessToken;
                headers = headers.set('Authorization', 'Bearer ' + accessToken);
            }
            // to determine the Accept header
            let httpHeaderAccepts: string[] = [
                'application/json'
            ];
            const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
            if (httpHeaderAcceptSelected != undefined) {
                headers = headers.set('Accept', httpHeaderAcceptSelected);
            }
    
            // to determine the Content-Type header
            const consumes: string[] = [
                'application/json'
            ];
            const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
            if (httpContentTypeSelected != undefined) {
                headers = headers.set('Content-Type', httpContentTypeSelected);
            }
    
            return this.httpClient.request<ResponseStatus>('post',`${this.basePath}/consultas/${encodeURIComponent(String(idConsulta))}/autorizados`,
                {
                    body: body,
                    withCredentials: this.configuration.withCredentials,
                    headers: headers,
                    observe: observe,
                    reportProgress: reportProgress
                }
            );
        }

        /**
     * Eliminar una autorización de usuario por ID
     * 
     * @param idConsulta 
     * @param idAsociado 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public consultasIdConsultaAutorizadosIdAsociadoDelete(idConsulta: number, idAsociado: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseStatus>;
    public consultasIdConsultaAutorizadosIdAsociadoDelete(idConsulta: number, idAsociado: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseStatus>>;
    public consultasIdConsultaAutorizadosIdAsociadoDelete(idConsulta: number, idAsociado: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseStatus>>;
    public consultasIdConsultaAutorizadosIdAsociadoDelete(idConsulta: number, idAsociado: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (idConsulta === null || idConsulta === undefined) {
            throw new Error('Required parameter idConsulta was null or undefined when calling consultasIdConsultaAutorizadosIdAsociadoDelete.');
        }

        if (idAsociado === null || idAsociado === undefined) {
            throw new Error('Required parameter idAsociado was null or undefined when calling consultasIdConsultaAutorizadosIdAsociadoDelete.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ResponseStatus>('delete',`${this.basePath}/consultas/${encodeURIComponent(String(idConsulta))}/autorizados/${encodeURIComponent(String(idAsociado))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Obtener una autorización de usuario por ID
     * 
     * @param idConsulta 
     * @param idAsociado 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
        public consultasIdConsultaAutorizadosIdAsociadoGet(idConsulta: number, idAsociado: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseAutorizacion>;
        public consultasIdConsultaAutorizadosIdAsociadoGet(idConsulta: number, idAsociado: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseAutorizacion>>;
        public consultasIdConsultaAutorizadosIdAsociadoGet(idConsulta: number, idAsociado: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseAutorizacion>>;
        public consultasIdConsultaAutorizadosIdAsociadoGet(idConsulta: number, idAsociado: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
    
            if (idConsulta === null || idConsulta === undefined) {
                throw new Error('Required parameter idConsulta was null or undefined when calling consultasIdConsultaAutorizadosIdAsociadoGet.');
            }
    
            if (idAsociado === null || idAsociado === undefined) {
                throw new Error('Required parameter idAsociado was null or undefined when calling consultasIdConsultaAutorizadosIdAsociadoGet.');
            }
    
            let headers = this.defaultHeaders;
    
            // authentication (bearerAuth) required
            if (this.configuration.accessToken) {
                const accessToken = typeof this.configuration.accessToken === 'function'
                    ? this.configuration.accessToken()
                    : this.configuration.accessToken;
                headers = headers.set('Authorization', 'Bearer ' + accessToken);
            }
            // to determine the Accept header
            let httpHeaderAccepts: string[] = [
                'application/json'
            ];
            const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
            if (httpHeaderAcceptSelected != undefined) {
                headers = headers.set('Accept', httpHeaderAcceptSelected);
            }
    
            // to determine the Content-Type header
            const consumes: string[] = [
            ];
    
            return this.httpClient.request<ResponseAutorizacion>('get',`${this.basePath}/consultas/${encodeURIComponent(String(idConsulta))}/autorizados/${encodeURIComponent(String(idAsociado))}`,
                {
                    withCredentials: this.configuration.withCredentials,
                    headers: headers,
                    observe: observe,
                    reportProgress: reportProgress
                }
            );
        }

            /**
     * Obtener resultados de una consulta por ID de consulta
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public consultasIdResultadosGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ResultadoConsulta>;
    public consultasIdResultadosGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResultadoConsulta>>;
    public consultasIdResultadosGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResultadoConsulta>>;
    public consultasIdResultadosGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling consultasIdResultadosGet.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearerAuth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ResultadoConsulta>('get',`${this.basePath}/consultas/${encodeURIComponent(String(id))}/resultados`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
