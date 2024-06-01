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

  obtenerMaterialPorId(codigo: string){
    return this.clienteHttp.get<Inventario>(`${this.urlBase}/${codigo}`);
  }

  editarMaterial(codigo: string, material: Inventario): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${codigo}`, material);
  }

  eliminarMaterial(codigo: string): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${codigo}`);
  }
}
