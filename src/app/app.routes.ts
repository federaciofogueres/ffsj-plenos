import { Routes } from '@angular/router';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlenoComponent } from './components/pleno/pleno.component';
import { PlenosComponent } from './components/plenos/plenos.component';
import { VotacionesComponent } from './components/votaciones/votaciones.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'plenos/:idPleno', component: PlenoComponent, canActivate: [AuthGuard] },
    { path: 'plenos', component: PlenosComponent, canActivate: [AuthGuard] },
    { path: 'asistencia', component: AsistenciaComponent, canActivate: [AuthGuard] },
    { path: 'votaciones', component: VotacionesComponent, canActivate: [AuthGuard] },
    { path: 'documentos', component: DocumentosComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: HomeComponent, canActivate: [AuthGuard] },
];
