import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovimientoInventario } from '../models/movimiento-inventario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private urlBase = "http://localhost:8080/felinus-app/movimientos"

  constructor(private clienteHttp: HttpClient) { }

  obtenerMovimiento():Observable<MovimientoInventario[]> {
    return this.clienteHttp.get<MovimientoInventario[]>(this.urlBase);
  }

  agregarMovimiento(movimiento: MovimientoInventario): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, movimiento);
  }

  obtenerMovimientoPorId(codigo: string){
    return this.clienteHttp.get<MovimientoInventario>(`${this.urlBase}/${codigo}`);
  }

  editarMovimiento(codigo: string, movimiento: MovimientoInventario): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${codigo}`, movimiento);
  }

  eliminarMovimiento(codigo: string): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${codigo}`);
  }
}
