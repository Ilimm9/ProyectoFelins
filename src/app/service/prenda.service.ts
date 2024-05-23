import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prenda } from '../models/prenda';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  private urlBase = "http://localhost:8080/felinus-app/prendas"

  constructor(private clienteHttp: HttpClient) { }

  obtenerPrendas():Observable<Prenda[]> {
    return this.clienteHttp.get<Prenda[]>(this.urlBase);
  }

  agregarPrenda(prenda: Prenda): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, prenda);
  }

  obtenerPrendaPorId(id: number){
    return this.clienteHttp.get<Prenda>(`${this.urlBase}/${id}`);
  }

  editarPrenda(id: number, prenda: Prenda): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, prenda);
  }

  eliminarPrenda(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

}
