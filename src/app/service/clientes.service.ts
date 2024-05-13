import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlBase = "http://localhost:8080/felinus-app/clientes"

  constructor(private ClienteHttp: HttpClient) { }

  obtenerClientes(): Observable<Cliente[]> {
    return this.ClienteHttp.get<Cliente[]>(this.urlBase);
  }
}
