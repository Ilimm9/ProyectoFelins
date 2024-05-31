import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { Departamento } from '../../models/departamento';
import { Cliente } from '../../models/cliente';
import { Empleado } from '../../models/empleado';
import { DepartamentosService } from '../../service/departamentos.service';
import { ClientesService } from '../../service/clientes.service';
import { EmpleadosService } from '../../service/empleados.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ImgUsuarioService } from '../../service/img-usuario.service';
import { Observable, of, tap } from 'rxjs';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { OrdenService } from '../../service/orden.service';
import { Orden } from '../../models/orden';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, AlertMessagesModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  departamentos: Departamento[]
  clientes: Cliente[]
  empleados: Empleado[]
  ordenes: Orden[]

  empleado: Empleado = new Empleado();
  cliente: Cliente = new Cliente();
  depto: Departamento = new Departamento();

  @ViewChild("empleadoForm") empleadoForm: NgForm
  @ViewChild('botonCerrarEmpleado') botonCerrarEmpleado: ElementRef;

  @ViewChild("clienteForm") clienteForm: NgForm
  @ViewChild('botonCerrarCliente') botonCerrarCliente: ElementRef;

  @ViewChild("deptoForm") deptoForm: NgForm
  @ViewChild('botonCerrarDepto') botonCerrarDepto: ElementRef;

  constructor(
    private departamentoService: DepartamentosService,
    private clienteService: ClientesService,
    private empleadoService: EmpleadosService,
    private imagenEmpleadoService: ImgUsuarioService,
    private router: Router,
    private alertMessage: AlertMessagesService,
    private ordenService: OrdenService
  ) {

  }

  imagenUrl: string; // Variable para almacenar la URL de la imagen
  // Define una variable para almacenar el archivo globalmente
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;

  ngOnInit() {
    this.obtenerOrdenes();
    this.obtenerDepartamentos();
    this.obtenerClientes();
    this.obtenerEmpleados();

    this.inicilizarDatosEmpleado();
    this.inicilizarDatosCliente();
    this.inicilizarDatosDepto();
  }

  obtenerOrdenes() {
    this.ordenService.obtenerOrdenes().subscribe(
      (datos => {
        this.ordenes = datos;
      })
    );
  }

  //PARA EL CRUD DE EMPLEADOS

  inicilizarDatosEmpleado() {
    //agregamos estos datos temporalmente para evitar conflictos
    this.empleado.idUsuario = 0;
    this.empleado.departamentos.push(new Departamento());
    this.empleado.departamentos[0].idDepto = 0;
  }

  limpiarDatosEmpleado() {
    this.empleado = new Empleado();
    this.empleado.idUsuario = 0;
    this.inicilizarDatosEmpleado();
    this.empleadoForm.resetForm();
    this.imagenUrl = "";
    this.previewUrl = "";
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


  agregarEmpleado() {
    this.empleadoService.agregarEmpleado(this.empleado).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerEmpleados();
            this.alertMessage.show('Empleado Agregado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('empleado agregado')
          });
          console.log(datos);
        },
        error: (error: any) => { console.log(error) }
      }
    );
    
  }

  editarEmpleado() {
    console.log('entramos a guardar los cambios')
    this.empleadoService.editarEmpleado(this.empleado.idUsuario, this.empleado).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerEmpleados();
            this.alertMessage.show('Empleado Modificado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('empleado modificado')
          });
          console.log(datos);
          console.log(this.archivoSeleccionado)
          if (this.archivoSeleccionado != null) {
            this.subirImagenEmpleado(this.empleado.idUsuario);
            console.log('imagen cargada en la BD');
          }
        },
        error: (errores) => console.log(errores)
      }
    );

  }

  //Al dar clic en editar se carga la variable con los datos del empleado correspondiente
  cargarEmpleado(id: number) {
    this.empleado.idUsuario = id;
    this.empleadoService.obtenerEmpleadoPorId(id).subscribe(
      {
        next: (datos) => this.empleado = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
    this.obtenerImagenEmpleado(this.empleado.idUsuario);
    console.log(this.empleado.nombre)
  }

  comprasTotales(): number {
    return this.ordenes.length;
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Almacena el archivo seleccionado en la variable archivoSeleccionado
      this.archivoSeleccionado = input.files[0];

      // Generar una URL de vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.archivoSeleccionado);

      // reader.readAsArrayBuffer(this.archivoSeleccionado);
    }
  }

  subirImagenEmpleado(idUsuario: number): void {
    // Asegúrate de que la prenda tenga un ID válido
    if (!idUsuario) {
      console.error('La prenda no tiene un ID válido.');
      return;
    }

    // Llama al servicio para agregar la imagen a la prenda en la base de datos
    if (this.archivoSeleccionado == null) {
      console.log('no se selecciono un archivo')
      return;
    }
    this.imagenEmpleadoService.agregarImagenEmpleado(idUsuario, this.archivoSeleccionado).subscribe(
      response => {
        console.log('Imagen agregada correctamente a la prenda.');
        // Aquí puedes hacer lo que necesites después de subir la imagen
      },
      error => console.error('Error al subir la imagen a la prenda: ', error)
    );
  }

  subirImagenEmpleadoAgregar(idUsuario: number): Observable<any> {
    // Asegúrate de que la prenda tenga un ID válido
    if (!idUsuario) {
      console.error('La prenda no tiene un ID válido.');
      return of(null); // Devolver un observable nulo
    }

    // Llama al servicio para agregar la imagen a la prenda en la base de datos
    if (this.archivoSeleccionado == null) {
      console.log('no se selecciono un archivo');
      return of(null); // Devolver un observable nulo
    }
    return this.imagenEmpleadoService.agregarImagenEmpleado(idUsuario, this.archivoSeleccionado);
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

  //PARA EL CRUD DE CLIENTES

  eliminarCliente(id: number) {
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

  cargarCliente(id: number) {
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

  agregarCliente() {
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

  inicilizarDatosCliente() {
    //agregamos estos datos temporalmente para evitar conflictos
    this.cliente.idUsuario = 0;
  }

  limpiarDatosCliente() {
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

  eliminarDepto(id: number) {
    this.departamentoService.eliminarDepartamento(id).subscribe({
      next: (datos) => this.obtenerDepartamentos(),
      error: (errores) => console.log(errores)
    });
  }

  cargarDepto(id: number) {
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

  agregarDepto() {
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

  inicilizarDatosDepto() {
    //agregamos estos datos temporalmente para evitar conflictos
    this.depto.idDepto = 0;
  }

  limpiarDatosDepto() {
    this.depto = new Departamento();
    this.inicilizarDatosDepto();
    this.deptoForm.resetForm();
  }


}
