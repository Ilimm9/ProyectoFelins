import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CargarScriptService } from '../../cargar-script.service';


@Component({
  selector: 'app-doc-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './doc-sidenav.component.html',
  styleUrl: './doc-sidenav.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocSidenavComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor (private _CargarScript:CargarScriptService){
    _CargarScript.Carga(["video"])
  }

}