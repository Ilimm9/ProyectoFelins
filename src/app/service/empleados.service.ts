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

  agregarEmpleado(empleado: Empleado): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, empleado);
  }

  obtenerEmpleadoPorId(id: number){
    return this.clienteHttp.get<Empleado>(`${this.urlBase}/${id}`);
  }

  editarEmpleado(id: number, empleado: Empleado): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }

}
