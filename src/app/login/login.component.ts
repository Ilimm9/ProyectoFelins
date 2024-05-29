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
    if(this.empleadoLoggedService.getIsLogin()){
      this.router.navigate(['/' + (this.empleadoLoggedService.getEmpleado().departamentos[0].nombre).toLowerCase()])
    }
    this.obtenerEmpleados();
    
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
    let encontrado = false
    this.empleados.forEach(empleado => {
      if (empleado.usuario === this.usuario && empleado.password == this.password) {
        //este empleado se actualiza en el servicio
        this.empleado = empleado;
        console.log('puedes entrar');
        console.log(empleado.usuario)
        console.log(empleado.password)
        console.log((empleado.departamentos[0].nombre).toLowerCase)

        this.empleadoLoggedService.setEmpleado(empleado);
        this.empleadoLoggedService.setIsLogin(true);
        
        this.router.navigate(['/' + (empleado.departamentos[0].nombre).toLowerCase()])
        //este actualiza la variable bool para login
        encontrado = true
        return
      }
    })

    if(!encontrado){
      console.log('no encontrado')
      this.alertMessage.show('Verifica tu usuario y contraseña', {cssClass:'alert alert-warning', timeOut: 3000})
      this.usuario = ''
      this.password = ''
    }

  }

}
