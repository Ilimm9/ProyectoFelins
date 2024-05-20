import { Component } from '@angular/core';
import { Departamento } from '../models/departamento';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { DepartamentosService } from '../service/departamentos.service';
import { ClientesService } from '../service/clientes.service';
import { EmpleadosService } from '../service/empleados.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [RouterOutlet, RouterLink,NavbarComponent],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
  departamentos: Departamento[]
  clientes: Cliente[]
  empleados: Empleado[]

  constructor(private departamentoService: DepartamentosService, private clienteService: ClientesService, private empleadoService: EmpleadosService, private router: Router){
    
  }

  ngOnInit(){
  }


}
