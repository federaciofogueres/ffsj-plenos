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
 */
import { Status } from './status';
import { Votacion } from './votacion';

export interface ResponseVotaciones { 
    votaciones: Array<Votacion>;
    status: Status;
}