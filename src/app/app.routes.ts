import { Routes } from '@angular/router';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlenoComponent } from './components/pleno/pleno.component';
import { PlenosComponent } from './components/plenos/plenos.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
import { AsistenciaCheckGuard } from './guards/asistencia-check.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'plenos/:idPleno', component: PlenoComponent, canActivate: [AuthGuard, AsistenciaCheckGuard] },
    { path: 'plenos', component: PlenosComponent, canActivate: [AuthGuard] },
    { path: 'asistencia', component: AsistenciaComponent, canActivate: [AuthGuard] },
    { path: 'asistencia/:idPleno', component: AsistenciaComponent, canActivate: [AuthGuard] },
    { path: 'votaciones', component: VotacionesComponent, canActivate: [AuthGuard, AsistenciaCheckGuard] },
    { path: 'documentos', component: DocumentosComponent, canActivate: [AuthGuard, AsistenciaCheckGuard] },
    { path: 'admin', component: AdministracionComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: HomeComponent, canActivate: [AuthGuard] },
];
