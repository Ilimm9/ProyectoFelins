import { Routes } from '@angular/router';
import { CorteComponent } from './corte/corte.component';
import { DisenioComponent } from './disenio/disenio.component';
import { LoginComponent } from './login/login.component';
import { ConfeccionComponent } from './confeccion/confeccion.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { SublimacionComponent } from './sublimacion/sublimacion.component';
// import { PruebaComponent } from './prueba/prueba.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'administracion', component: AdministradorComponent},
    { path: 'diseño', component: DisenioComponent},
    { path: 'corte',component: CorteComponent},
    { path: 'sublimacion',component: SublimacionComponent},
    { path: 'confeccion', component: ConfeccionComponent},
    { path: 'almacen', component: AlmacenComponent},
    
    // { path: 'prueba', component: PruebaComponent}
];
