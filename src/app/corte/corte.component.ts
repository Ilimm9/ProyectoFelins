import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CargarScriptService } from '../cargar-script.service';

@Component({
  selector: 'app-corte',
  standalone: true,
  imports: [],
  templateUrl: './corte.component.html',
  styleUrl: './corte.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CorteComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor (private _CargarScript:CargarScriptService){
    _CargarScript.Carga(["video"])
  }

}

