import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocNavbarComponent } from './componentes/doc-navbar/doc-navbar.component';
import { DocSidenavComponent } from './componentes/doc-sidenav/doc-sidenav.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavbarVerticalComponent } from './componentes/navbar-vertical/navbar-vertical.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DocNavbarComponent,DocSidenavComponent, NavbarVerticalComponent, HeaderComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProyectoFelinus';
}
