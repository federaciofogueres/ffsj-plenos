/**
 * Plenos API
 * API para gestionar consultas de usuarios.
 *
 * OpenAPI spec version: 3.0.0
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

import { PuntoOrdenDelDia } from '../model/puntoOrdenDelDia';
import { ResponseDocumentos } from '../model/responseDocumentos';
import { ResponsePuntosOrdenDelDia } from '../model/responsePuntosOrdenDelDia';
import { ResponseVotaciones } from '../model/responseVotaciones';
import { Status } from '../model/status';

import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';


@Injectable({providedIn: 'root'})
export class PuntosOrdenDelDiaService {

    protected basePath = 'https://virtserver.swaggerhub.com/FFSJ/APP-Plenos/1.0.0';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Obtener todos los puntos del orden del día
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaGet(observe?: 'body', reportProgress?: boolean): Observable<ResponsePuntosOrdenDelDia>;
    public puntosOrdenDelDiaGet(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsePuntosOrdenDelDia>>;
    public puntosOrdenDelDiaGet(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsePuntosOrdenDelDia>>;
    public puntosOrdenDelDiaGet(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<ResponsePuntosOrdenDelDia>('get',`${this.basePath}/puntos_orden_del_dia`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Eliminar un punto del orden del día por ID
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaIdDelete(id: number, observe?: 'body', reportProgress?: boolean): Observable<Status>;
    public puntosOrdenDelDiaIdDelete(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Status>>;
    public puntosOrdenDelDiaIdDelete(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Status>>;
    public puntosOrdenDelDiaIdDelete(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling puntosOrdenDelDiaIdDelete.');
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

        return this.httpClient.request<Status>('delete',`${this.basePath}/puntos_orden_del_dia/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Obtener documentos de un punto del día por ID del punto
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaIdDocumentosGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseDocumentos>;
    public puntosOrdenDelDiaIdDocumentosGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDocumentos>>;
    public puntosOrdenDelDiaIdDocumentosGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDocumentos>>;
    public puntosOrdenDelDiaIdDocumentosGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling puntosOrdenDelDiaIdDocumentosGet.');
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

        return this.httpClient.request<ResponseDocumentos>('get',`${this.basePath}/puntos_orden_del_dia/${encodeURIComponent(String(id))}/documentos`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Obtener un punto del orden del día por ID
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaIdGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<PuntoOrdenDelDia>;
    public puntosOrdenDelDiaIdGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PuntoOrdenDelDia>>;
    public puntosOrdenDelDiaIdGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PuntoOrdenDelDia>>;
    public puntosOrdenDelDiaIdGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling puntosOrdenDelDiaIdGet.');
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

        return this.httpClient.request<PuntoOrdenDelDia>('get',`${this.basePath}/puntos_orden_del_dia/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Actualizar un punto del orden del día por ID
     * 
     * @param body 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaIdPut(body: PuntoOrdenDelDia, id: number, observe?: 'body', reportProgress?: boolean): Observable<Status>;
    public puntosOrdenDelDiaIdPut(body: PuntoOrdenDelDia, id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Status>>;
    public puntosOrdenDelDiaIdPut(body: PuntoOrdenDelDia, id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Status>>;
    public puntosOrdenDelDiaIdPut(body: PuntoOrdenDelDia, id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling puntosOrdenDelDiaIdPut.');
        }

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling puntosOrdenDelDiaIdPut.');
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

        return this.httpClient.request<Status>('put',`${this.basePath}/puntos_orden_del_dia/${encodeURIComponent(String(id))}`,
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
     * Obtener votaciones de un punto del día por ID del punto
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaIdVotacionesGet(id: number, observe?: 'body', reportProgress?: boolean): Observable<ResponseVotaciones>;
    public puntosOrdenDelDiaIdVotacionesGet(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseVotaciones>>;
    public puntosOrdenDelDiaIdVotacionesGet(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseVotaciones>>;
    public puntosOrdenDelDiaIdVotacionesGet(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling puntosOrdenDelDiaIdVotacionesGet.');
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

        return this.httpClient.request<ResponseVotaciones>('get',`${this.basePath}/puntos_orden_del_dia/${encodeURIComponent(String(id))}/votaciones`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Crear un nuevo punto del orden del día
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public puntosOrdenDelDiaPost(body: PuntoOrdenDelDia, observe?: 'body', reportProgress?: boolean): Observable<Status>;
    public puntosOrdenDelDiaPost(body: PuntoOrdenDelDia, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Status>>;
    public puntosOrdenDelDiaPost(body: PuntoOrdenDelDia, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Status>>;
    public puntosOrdenDelDiaPost(body: PuntoOrdenDelDia, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling puntosOrdenDelDiaPost.');
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

        return this.httpClient.request<Status>('post',`${this.basePath}/puntos_orden_del_dia`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}