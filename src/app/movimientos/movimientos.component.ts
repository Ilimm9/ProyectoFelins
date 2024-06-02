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

  movimiento: MovimientoInventario = new MovimientoInventario();

  movimientos: MovimientoInventario[]

  ngOnInit(){
    this.obtenerMovimientos();
    // this.orden.cliente = new Cliente();
    // this.orden.prenda = new Prenda();
    // this.orden.empleado = new Empleado();
  }

  obtenerMovimientos(){

  }

  cargarMovimiento(clave : String){

  }

  accionMovimiento(){

  }

  limpiarDatosMovimiento(){
    
  }

}
