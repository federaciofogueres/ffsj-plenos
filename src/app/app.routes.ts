import { Routes } from '@angular/router';
import { AuthGuard } from 'ffsj-web-components';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';

export const routes: Routes = [
    { path: 'asistencia', component: AsistenciaComponent },
    { path: 'votaciones', component: VotacionesComponent, canActivate: [AuthGuard] },
    { path: 'documentos', component: DocumentosComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: HomeComponent },
];
