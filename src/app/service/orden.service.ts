import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orden } from '../models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private urlBase = "http://localhost:8080/felinus-app/ordenes"

  constructor(private clienteHttp: HttpClient) { }

  obtenerOrdenes():Observable<Orden[]> {
    return this.clienteHttp.get<Orden[]>(this.urlBase);
  }

  agregarOrden(orden: Orden): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, orden);
  }

  obtenerOrdenPorId(id: number){
    return this.clienteHttp.get<Orden>(`${this.urlBase}/${id}`);
  }

  editarOrden(id: number, orden: Orden): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, orden);
  }

  eliminarOrden(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

}
