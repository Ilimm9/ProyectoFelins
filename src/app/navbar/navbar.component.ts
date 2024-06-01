import { Component, ElementRef, ViewChild } from '@angular/core';
import { Empleado } from '../models/empleado';
import { EmpleadoLoggedService } from '../service/empleado-logged.service';
import { ImgUsuarioService } from '../service/img-usuario.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { EmpleadosService } from '../service/empleados.service';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, AlertMessagesModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  empleado: Empleado;
  isLogin: boolean = false;
  imagenUrl: string;
  nombre: String;
  depto: String;

  anterior: string
  password: string
  confirmacion: string

  @ViewChild("passForm") passForm: NgForm;
  @ViewChild('botonCerrarPass') botonCerrarPass: ElementRef;

  constructor(
    private empleadoService: EmpleadosService,
    private empleadoLoggedService: EmpleadoLoggedService,
    private alertMessage: AlertMessagesService,
    private imagenEmpleadoService: ImgUsuarioService,
    private router: Router) { }

  ngOnInit() {

    if (this.empleadoLoggedService.getIsLogin()) {
      this.obtenerImagenEmpleado(this.empleadoLoggedService?.getEmpleado().curp);
      this.nombre = `${this.empleadoLoggedService.getEmpleado().nombre} ${this.empleadoLoggedService.getEmpleado().apPaterno} `;
      this.depto = this.empleadoLoggedService.getEmpleado().departamento.nombre.toUpperCase();
    } else {
      console.log('usuario nulo')
    }
    this.empleado = this.empleadoLoggedService.getEmpleado();

  }


  obtenerImagenEmpleado(curp: string): void {
    console.log('vamos a intentar ver la imagen')
    this.imagenEmpleadoService.obtenerImagenEmpleado(curp).subscribe(
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

  validarPassword(password: string): boolean {
    // Validar la contraseña con la expresión regular
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    return regex.test(password);
  }

  cambiarPassword() {
    console.log('entramos al metodo de password')
    if (this.empleado?.password !== this.anterior) {
      this.alertMessage.show('Contraseña anterior erronea', { cssClass: 'alert alert-warning', timeOut: 3000 })
      return;
    }
    if(!this.validarPassword(this.password)){
      this.alertMessage.show('Contraseña nueva no cumple formato', { cssClass: 'alert alert-warning', timeOut: 3000 })
      return;
    }
    if(!this.validarPassword(this.confirmacion)){
      this.alertMessage.show('Confirmacion no cumple formato', { cssClass: 'alert alert-warning', timeOut: 3000 })
      return;
    }
    if (this.password === this.confirmacion) {
      console.log('nuevas correctas : ' + this.password)
      this.empleado.password = this.password;
      console.log(this.empleado)
      // this.editarEmpleado();
      this.editarEmpleado();
    }else {
      this.alertMessage.show('No coinciden', { cssClass: 'alert alert-warning', timeOut: 3000 })
      return;
    }

    this.passForm.resetForm();
    //this.botonCerrarPass.nativeElement.click();
  }

  editarEmpleado() {
    console.log('entramos a guardar los cambios')

    this.empleadoService.editarEmpleado(this.empleado.curp, this.empleado).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/fase/' + (this.empleado.departamento.nombre).toLowerCase()]).then(() => {
            this.alertMessage.show('Contraseña Modificada Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 4000 })
            console.log('empleado modificado')
          });
          console.log(datos);
        },
        error: (errores) => console.log(errores)
      }
    );
  }

  cerrarSesion() {
    this.empleadoLoggedService.setIsLogin(false);
    this.router.navigate(['/login'])
  }

}
