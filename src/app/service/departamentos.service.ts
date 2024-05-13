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
}
