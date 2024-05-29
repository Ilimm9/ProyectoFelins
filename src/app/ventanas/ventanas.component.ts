import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ventanas',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './ventanas.component.html',
  styleUrl: './ventanas.component.css'
})
export class VentanasComponent {

}
