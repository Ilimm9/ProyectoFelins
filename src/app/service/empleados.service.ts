import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private urlBase = "http://localhost:8080/felinus-app/empleados"

  constructor(private clienteHttp: HttpClient) { }

  obtenerEmpleados():Observable<Empleado[]> {
    return this.clienteHttp.get<Empleado[]>(this.urlBase);
  }
}
