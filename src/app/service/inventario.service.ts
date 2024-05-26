import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventario } from '../models/inventario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private urlBase = "http://localhost:8080/felinus-app/materiales"

  constructor(private clienteHttp: HttpClient) { }

  obtenerMateriales():Observable<Inventario[]> {
    return this.clienteHttp.get<Inventario[]>(this.urlBase);
  }

  agregarMaterial(material: Inventario): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, material);
  }

  obtenerMaterialPorId(id: number){
    return this.clienteHttp.get<Inventario>(`${this.urlBase}/${id}`);
  }

  editarMaterial(id: number, material: Inventario): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, material);
  }

  eliminarMaterial(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }
}
