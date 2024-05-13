import { Component, OnInit } from '@angular/core';
import { DepartamentosService } from '../service/departamentos.service';
import { Departamento } from '../models/departamento';
import { ClientesService } from '../service/clientes.service';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { EmpleadosService } from '../service/empleados.service';

@Component({
  selector: 'app-prueba-depto',
  standalone: true,
  imports: [],
  templateUrl: './prueba-depto.component.html',
  styleUrl: './prueba-depto.component.css',
})
export class PruebaDeptoComponent {

  departamentos: Departamento[]
  clientes: Cliente[]
  empleados: Empleado[]

  constructor(private departamentoService: DepartamentosService, private clienteService: ClientesService, private empleadoService: EmpleadosService){
    
  }

  ngOnInit(){
    this.obtenerDepartamentos();
    this.obtenerClientes();
    this.obtenerEmpleados();
  }
  
  private obtenerDepartamentos(){
    this.departamentoService.obtenerDepartamentos().subscribe(
      (datos => {
        this.departamentos = datos;
      })
    );
    console.log(this.departamentos)
  }

  private obtenerClientes(){
    this.clienteService.obtenerClientes().subscribe(
      (datos => {
        this.clientes = datos;
      })
    );
    console.log(this.clientes)
  }

  private obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados().subscribe(
      (datos => {
        this.empleados = datos;
      })
    );
    console.log(this.empleados);
  }

  obtenerNombresDepartamentos(depto: Departamento[]): string {
    // Utilizamos map para obtener un array de nombres de departamentos
    const nombres: string[] = depto.map((depto: Departamento) => depto.nombre);
    // Usamos join para unir los nombres con '|'
    return nombres.join(' | ');
}


}
