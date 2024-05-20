import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlBase = "http://localhost:8080/felinus-app/clientes"

  constructor(private clienteHttp: HttpClient) { }

  obtenerClientes(): Observable<Cliente[]> {
    return this.clienteHttp.get<Cliente[]>(this.urlBase);
  }

  agregarCliente(cliente: Cliente): Observable<Object>{
    return this.clienteHttp.post(this.urlBase, cliente);
  }

  obtenerClientePorId(id: number){
    return this.clienteHttp.get<Cliente>(`${this.urlBase}/${id}`);
  }

  editarCliente(id: number, cliente: Cliente): Observable<Object>{
    return this.clienteHttp.put(`${this.urlBase}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<Object>{
    return this.clienteHttp.delete(`${this.urlBase}/${id}`);
  }


}
