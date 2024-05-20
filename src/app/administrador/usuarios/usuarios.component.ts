import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Departamento } from '../../models/departamento';
import { Cliente } from '../../models/cliente';
import { Empleado } from '../../models/empleado';
import { DepartamentosService } from '../../service/departamentos.service';
import { ClientesService } from '../../service/clientes.service';
import { EmpleadosService } from '../../service/empleados.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  departamentos: Departamento[]
  clientes: Cliente[]
  empleados: Empleado[]

  empleado: Empleado = new Empleado();
  cliente: Cliente = new Cliente();
  depto: Departamento = new Departamento();

  @ViewChild("empleadoForm") empleadoForm: NgForm
  @ViewChild('botonCerrarEmpleado') botonCerrarEmpleado: ElementRef;

  @ViewChild("clienteForm") clienteForm: NgForm
  @ViewChild('botonCerrarCliente') botonCerrarCliente: ElementRef;

  @ViewChild("deptoForm") deptoForm: NgForm
  @ViewChild('botonCerrarDepto') botonCerrarDepto: ElementRef;

  constructor(private departamentoService: DepartamentosService, private clienteService: ClientesService, private empleadoService: EmpleadosService, private router: Router) {

  }

  ngOnInit() {
    this.obtenerDepartamentos();
    this.obtenerClientes();
    this.obtenerEmpleados();

    this.inicilizarDatosEmpleado();
    this.inicilizarDatosCliente();
    this.inicilizarDatosDepto();
  }

  //PARA EL CRUD DE EMPLEADOS

  inicilizarDatosEmpleado(){
    //agregamos estos datos temporalmente para evitar conflictos
    this.empleado.idUsuario = 0;
    this.empleado.departamentos.push(new Departamento());
    this.empleado.departamentos[0].idDepto = 0;
  }

  limpiarDatosEmpleado(){
    this.empleado = new Empleado();
    this.inicilizarDatosEmpleado();
    this.empleadoForm.resetForm();
  }

  eliminarEmpleado(id: number) {
    this.empleadoService.eliminarEmpleado(id).subscribe(
      {
        next: (datos) => this.obtenerEmpleados(),
        error: (errores) => console.log(errores)
      }
    );
  }

  accionEmpleado(empleadoForm: NgForm) {
    //verificamos si vamos agregar o editar
    if (this.empleado.idUsuario != 0) {
      console.log('Editamos')
      this.editarEmpleado();
    } else {
      console.log('Nuevo empleado')
      this.agregarEmpleado();
    }
    //cerramos el modal
    this.empleadoForm.resetForm();
    this.cerrarModalEmpleado();

  }

  agregarEmpleado(){
    this.empleadoService.agregarEmpleado(this.empleado).subscribe(
      {
        next: (datos) => {
          //son los datos regresados pero por el momento no se ocupan
          this.router.navigate(['/administracion/usuarios']);
        },
        error: (error: any) => { console.log(error) }
      }
    );
    console.log('empleado agregado')
  }

  editarEmpleado() {
    console.log('entramos a guardar los cambios')
    this.empleadoService.editarEmpleado(this.empleado.idUsuario, this.empleado).subscribe(
      {
        next: (datos) => console.log('realizado'),
        error: (errores) => console.log(errores)
      }
    );
    this.router.navigate(['/administracion/usuarios']).then(() => {
      // window.location.reload();
      this.obtenerEmpleados();
    })
  }

  //Al dar clic en editar se carga la variable con los datos del empleado correspondiente
  cargarEmpleado(id: number) {
    this.empleadoService.obtenerEmpleadoPorId(id).subscribe(
      {
        next: (datos) => this.empleado = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
    console.log(this.empleado.nombre)
  }

  comprasTotales(): number {
    let total = 0;
    this.clientes.forEach(cliente => {
      total += cliente.totalCompras;
    })
    return total
  }

  empleadosActivos(): number {
    let activos = 0
    this.empleados.forEach(empleado => {
      if (empleado.activo) {
        activos++;
      }
    })
    return activos
  }
  private obtenerEmpleados() {
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

  private cerrarModalEmpleado() {
    this.botonCerrarEmpleado.nativeElement.click();
  }

  //PARA EL CRUD DE CLIENTES

  eliminarCliente(id: number){
    this.clienteService.eliminarCliente(id).subscribe({
      next: (datos) => this.obtenerClientes(),
      error: (errores) => console.log(errores)
    });
  }

  private obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe(
      (datos => {
        this.clientes = datos;
      })
    );
    console.log(this.clientes)
  }

  cargarCliente(id: number){
    this.clienteService.obtenerClientePorId(id).subscribe(
      {
        next: (datos) => this.cliente = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
    console.log(this.cliente.nombre)
  }

  accionCliente(clienteForm: NgForm) {
    //verificamos si vamos agregar o editar
    if (this.cliente.idUsuario != 0) {
      console.log('Editamos')
      this.editarCliente();
    } else {
      console.log('Nuevo cliente')
      this.agregarCliente();
    }
    //cerramos el modal
    this.clienteForm.resetForm();
    this.botonCerrarCliente.nativeElement.click();

  }

  agregarCliente(){
    this.clienteService.agregarCliente(this.cliente).subscribe(
      {
        next: (datos) => {
          //son los datos regresados pero por el momento no se ocupan
          this.router.navigate(['/administracion/usuarios']);
        },
        error: (error: any) => { console.log(error) }
      }
    );
    console.log('cliente agregado')
  }

  editarCliente() {
    console.log('entramos a guardar los cambios')
    this.clienteService.editarCliente(this.cliente.idUsuario, this.cliente).subscribe(
      {
        next: (datos) => console.log('realizado'),
        error: (errores) => console.log(errores)
      }
    );
    this.router.navigate(['/administracion/usuarios']).then(() => {
      // window.location.reload();
      this.obtenerClientes();
    })
  }

  inicilizarDatosCliente(){
    //agregamos estos datos temporalmente para evitar conflictos
    this.cliente.idUsuario = 0;
  }

  limpiarDatosCliente(){
    this.cliente = new Cliente();
    this.inicilizarDatosCliente();
    this.clienteForm.resetForm();
  }


  //PARA EL CRUD DE DEPARTAMENTOS

  private obtenerDepartamentos() {
    this.departamentoService.obtenerDepartamentos().subscribe(
      (datos => {
        this.departamentos = datos;
      })
    );
    console.log(this.departamentos)
  }

  eliminarDepto(id: number){
    this.departamentoService.eliminarDepartamento(id).subscribe({
      next: (datos) => this.obtenerDepartamentos(),
      error: (errores) => console.log(errores)
    });
  }

  cargarDepto(id: number){
    this.departamentoService.obtenerDepartamentoPorId(id).subscribe(
      {
        next: (datos) => this.depto = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
    console.log(this.depto.nombre)
  }

  accionDepartamento(deptoForm: NgForm) {
    //verificamos si vamos agregar o editar
    if (this.depto.idDepto != 0) {
      console.log('Editamos')
      this.editarDepto();
    } else {
      console.log('Nuevo departamento')
      this.agregarDepto();
    }
    //cerramos el modal
    this.deptoForm.resetForm();
    this.botonCerrarDepto.nativeElement.click();

  }

  agregarDepto(){
    this.departamentoService.agregarDepartamento(this.depto).subscribe(
      {
        next: (datos) => {
          //son los datos regresados pero por el momento no se ocupan
          this.router.navigate(['/administracion/usuarios']);
        },
        error: (error: any) => { console.log(error) }
      }
    );
    console.log('departamento agregado')
  }

  editarDepto() {
    console.log('entramos a guardar los cambios')
    this.departamentoService.editarDepartamento(this.depto.idDepto, this.depto).subscribe(
      {
        next: (datos) => console.log('realizado'),
        error: (errores) => console.log(errores)
      }
    );
    this.router.navigate(['/administracion/usuarios']).then(() => {
      // window.location.reload();
      this.obtenerDepartamentos();
    })
  }

  inicilizarDatosDepto(){
    //agregamos estos datos temporalmente para evitar conflictos
    this.depto.idDepto = 0;
  }

  limpiarDatosDepto(){
    this.depto = new Departamento();
    this.inicilizarDatosDepto();
    this.deptoForm.resetForm();
  }


}
