import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CargarScriptService } from '../../cargar-script.service';

@Component({
  selector: 'app-navbar-vertical',
  standalone: true,
  imports: [],
  templateUrl: './navbar-vertical.component.html',
  styleUrl: './navbar-vertical.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarVerticalComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor (private _CargarScript:CargarScriptService){
    _CargarScript.Carga(["video"])
  }

}