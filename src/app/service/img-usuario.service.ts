import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgUsuarioService {

  private urlBaseEmpleado = "http://localhost:8080/felinus-app/img-empleado"
  private urlBaseCliente = "http://localhost:8080/felinus-app/img-cliente"

  constructor(private httpClient: HttpClient) { }

  // Agregar imagen a una prenda
  agregarImagenEmpleado(id: number, imagen: File): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('image', imagen, imagen.name);
    return this.httpClient.put(`${this.urlBaseEmpleado}/${id}`, formData);
  }

  // Obtener imagen de una prenda por su ID
  obtenerImagenEmpleado(id: number): Observable<Blob> {
    return this.httpClient.get(`${this.urlBaseEmpleado}/${id}`, { responseType: 'blob' });
  }

  // Agregar imagen a una prenda
  agregarImagenCliente(id: number, imagen: File): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('image', imagen, imagen.name);
    return this.httpClient.put(`${this.urlBaseCliente}/${id}`, formData);
  }

  // Obtener imagen de una prenda por su ID
  obtenerImagenCliente(id: number): Observable<Blob> {
    return this.httpClient.get(`${this.urlBaseCliente}/${id}`, { responseType: 'blob' });
  }

}
