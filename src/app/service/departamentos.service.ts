import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  private urlBase = "http://localhost:8080/felinus-app/departamentos"

  constructor(private clienteHttp: HttpClient) { }

  obtenerDepartamentos():Observable<Departamento[]> {
    return this.clienteHttp.get<Departamento[]>(this.urlBase);
  }

  agregarDepartamento(departamento: Departamento): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, departamento);
  }

  obtenerDepartamentoPorId(nombre: string){
    return this.clienteHttp.get<Departamento>(`${this.urlBase}/${nombre}`);
  }

  editarDepartamento(nombre: string, departamento: Departamento): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${nombre}`, departamento);
  }

  eliminarDepartamento(nombre: string): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${nombre}`);
  }

}
