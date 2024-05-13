
import { Component } from '@angular/core';
import { NavbarVerticalComponent } from '../componentes/navbar-vertical/navbar-vertical.component';
import { HeaderComponent } from '../componentes/header/header.component';

@Component({
  selector: 'app-corte',
  standalone: true,
  imports: [NavbarVerticalComponent, HeaderComponent, NavbarVerticalComponent],
  templateUrl: './corte.component.html',
  styleUrl: './corte.component.css',
})
export class CorteComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}

