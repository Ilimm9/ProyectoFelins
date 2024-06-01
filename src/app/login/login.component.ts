import { Component } from '@angular/core';
import { Empleado } from '../models/empleado';
import { EmpleadosService } from '../service/empleados.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { timeout } from 'rxjs';
import { EmpleadoLoggedService } from '../service/empleado-logged.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AlertMessagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  empleados: Empleado[]
  usuario: string
  password: string
  empleado: Empleado = new Empleado();


  constructor(
    private empleadoService: EmpleadosService,
    private router: Router,
    private alertMessage: AlertMessagesService,
    private empleadoLoggedService: EmpleadoLoggedService
  ) { }

  ngOnInit() {
    this.obtenerEmpleados();
    if (this.empleadoLoggedService.getIsLogin()) {
      this.router.navigate(['/' + (this.empleadoLoggedService.getEmpleado().departamento.nombre).toLowerCase()])
      if (this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase() !== 'administracion') {
        this.router.navigate(['/fase/' + (this.empleadoLoggedService.getEmpleado().departamento.nombre).toLowerCase()])
      } else {
        this.router.navigate(['/' + (this.empleadoLoggedService.getEmpleado().departamento.nombre).toLowerCase()])
      }    
    }
  }

  private obtenerEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe(
      (datos => {
        this.empleados = datos;
      })
    );
    console.log(this.empleados);
  }

  login() {
    console.log(this.password)
    console.log(this.usuario)
    console.log(this.empleados)
    let encontrado = false
    let mensaje = '';
    this.empleados.forEach(empleado => {

      if (empleado.usuario === this.usuario && empleado.password == this.password) {

        if(!empleado.activo){
          mensaje = 'Usuario Fuera de Servicio'
          return
        }
        //este empleado se actualiza en el servicio
        this.empleado = empleado;
        console.log('puedes entrar');

        this.empleadoLoggedService.setEmpleado(empleado);
        this.empleadoLoggedService.setIsLogin(true);
        if (empleado.departamento.nombre.toLowerCase() !== 'administracion') {
          this.router.navigate(['/fase/' + (empleado.departamento.nombre).toLowerCase()])
        } else {
          this.router.navigate(['/' + (empleado.departamento.nombre).toLowerCase()])
        }

        //este actualiza la variable bool para login
        encontrado = true
        return
      } else {
        mensaje = 'Verifica tu Usuario y Contraseña'
      }
    })

    if (!encontrado) {
      console.log('no puedes iniciar session')
      this.alertMessage.show(mensaje, { cssClass: 'alert alert-warning', timeOut: 3000 })
      this.usuario = ''
      this.password = ''
    }

  }

}
