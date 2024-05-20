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

  obtenerDepartamentoPorId(id: number){
    return this.clienteHttp.get<Departamento>(`${this.urlBase}/${id}`);
  }

  editarDepartamento(id: number, departamento: Departamento): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, departamento);
  }

  eliminarDepartamento(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

}
