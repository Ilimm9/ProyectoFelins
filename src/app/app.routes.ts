import { Routes } from '@angular/router';
import { CorteComponent } from './corte/corte.component';
import { DisenioComponent } from './disenio/disenio.component';
import { LoginComponent } from './login/login.component';
import { ConfeccionComponent } from './confeccion/confeccion.component';
import { AlmacenComponent } from './almacen/almacen.component';

export const routes: Routes = [
    { path: 'corte',component: CorteComponent},
    { path: 'disenio', component: DisenioComponent},
    { path: 'login', component: LoginComponent},
    { path: 'confeccion', component: ConfeccionComponent},
    { path: 'almacen', component: AlmacenComponent} 
];
