import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CargarScriptService } from '../../cargar-script.service';

@Component({
  selector: 'app-doc-navbar',
  standalone: true,
  imports: [],
  templateUrl: './doc-navbar.component.html',
  styleUrl: './doc-navbar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocNavbarComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor (private _CargarScript:CargarScriptService){
    _CargarScript.Carga(["video"])
  }

}