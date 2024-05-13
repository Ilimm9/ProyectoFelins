import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DocNavbarComponent } from './componentes/doc-navbar/doc-navbar.component';
import { DocSidenavComponent } from './componentes/doc-sidenav/doc-sidenav.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavbarVerticalComponent } from './componentes/navbar-vertical/navbar-vertical.component';
import { LoginComponent } from './login/login.component';
import { PruebaDeptoComponent } from './prueba-depto/prueba-depto.component';
import { DisenioComponent } from './disenio/disenio.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet,DocNavbarComponent,DocSidenavComponent, NavbarVerticalComponent, HeaderComponent, LoginComponent, PruebaDeptoComponent, DisenioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoFelinus';
}
export class AppModule {

}
