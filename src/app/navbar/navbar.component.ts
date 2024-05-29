import { Component } from '@angular/core';
import { Empleado } from '../models/empleado';
import { EmpleadoLoggedService } from '../service/empleado-logged.service';
import { ImgUsuarioService } from '../service/img-usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  empleado: Empleado | null = null;
  isLogin: boolean = false;
  imagenUrl: string;
  nombre: String;
  depto: String;

  constructor(
    private empleadoLoggedService: EmpleadoLoggedService,
    private imagenEmpleadoService: ImgUsuarioService,
    private router: Router) { }

  ngOnInit() {

    if (this.empleadoLoggedService.getIsLogin()) {
      this.obtenerImagenEmpleado(this.empleadoLoggedService?.getEmpleado().idUsuario);
      this.nombre = `${this.empleadoLoggedService.getEmpleado().nombre} ${this.empleadoLoggedService.getEmpleado().apPaterno} `;
      this.depto = this.empleadoLoggedService.getEmpleado().departamentos[0].nombre.toUpperCase();
    } else {
      console.log('usuario nulo')
    }
    
  }

  obtenerImagenEmpleado(idUsuario: number): void {
    console.log('vamos a intentar ver la imagen')
    this.imagenEmpleadoService.obtenerImagenEmpleado(idUsuario).subscribe(
      imagen => {
        // Convierte la imagen en una URL para mostrarla en el HTML
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagenUrl = reader.result as string;
        };
        reader.readAsDataURL(imagen);
      },
      error => console.error('Error al obtener imagen de la prenda: ', error)
    );
    console.log(this.imagenUrl)
  }

  cerrarSesion() {
    this.empleadoLoggedService.setIsLogin(false);
    this.router.navigate(['/login'])
  }
  
}
