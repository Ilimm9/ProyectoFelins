import { Component } from '@angular/core';
import { MovimientoInventario } from '../models/movimiento-inventario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css'
})
export class MovimientosComponent {

  movimiento: MovimientoInventario

  accionMovimiento(){

  }

  limpiarDatosMovimiento(){
    
  }

}
