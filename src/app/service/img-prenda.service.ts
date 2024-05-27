import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgPrendaService {

  private urlBase = "http://localhost:8080/felinus-app/img-prenda"

  constructor(private clienteHttp: HttpClient) { }

   // Agregar imagen a una prenda
   agregarImagenPrenda(id: number, imagen: File): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('image', imagen, imagen.name);
    return this.clienteHttp.put(`${this.urlBase}/${id}`, formData);
  }

  // Obtener imagen de una prenda por su ID
  obtenerImagenPrenda(id: number): Observable<Blob> {
    return this.clienteHttp.get(`${this.urlBase}/${id}`, { responseType: 'blob' });
  }
  
}
