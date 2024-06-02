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

  //manejar modales 
  mdEmpleado: string = 'agregar';
  mdCliente: string = 'agregar';
  mdDepto: string = 'agregar';

  //manejar tablas
  tabla: string = ''

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
    this.mdEmpleado = 'agregar';
    this.empleado = new Empleado();
    this.empleado.curp = "";
    this.empleado.departamento = new Departamento();
    this.imagenUrl = "";
    this.previewUrl = "";

  }

  resetFormEmpleado() {
    this.empleadoForm.resetForm();
    this.imagenUrl = "";
    this.previewUrl = "";
  }

  eliminarEmpleado(curp: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.empleadoService.eliminarEmpleado(curp).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerEmpleados();
            this.alertMessage.show('Empleado Eliminado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('empleado modificado')
          });
        },
        error: (errores) => console.log(errores)
      }
    );
    //cerramos el modal
    this.resetFormEmpleado();
    this.cerrarModalEmpleado();
  }

  accionEmpleado(empleadoForm: NgForm) {
    this.tabla = 'empleado'
    if (this.mdEmpleado === "editar") {
      console.log('Editamos')
      this.editarEmpleado();
    } else {
      console.log('Nuevo empleado')
      this.agregarEmpleado();
    }
    //cerramos el modal
    this.resetFormEmpleado();
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
    let curp = this.empleado.curp;
    this.empleadoService.editarEmpleado(this.empleado.curp, this.empleado).subscribe(
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
            this.subirImagenEmpleado(curp);
            console.log('imagen cargada en la BD');
          }
        },
        error: (errores) => {
          console.log(errores);
          this.alertMessage.show('Error al modificar!! ', { cssClass: 'alert alert-danger', timeOut: 3000 })
        }
      }
    );

  }

  //Al dar clic en editar se carga la variable con los datos del empleado correspondiente
  cargarEmpleado(curp: string) {
    this.mdEmpleado = 'editar';
    this.empleado.curp = curp;
    this.empleadoService.obtenerEmpleadoPorId(curp).subscribe(
      {
        next: (datos) => this.empleado = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(curp)
    this.obtenerImagenEmpleado(this.empleado.curp);
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

  subirImagenEmpleado(curp: string): void {
    // Asegúrate de que la prenda tenga un ID válido
    console.log(curp)
    if (!curp) {
      console.error('La prenda no tiene un ID válido.');
      return;
    }

    // Llama al servicio para agregar la imagen a la prenda en la base de datos
    if (this.archivoSeleccionado == null) {
      console.log('no se selecciono un archivo')
      return;
    }
    this.imagenEmpleadoService.agregarImagenEmpleado(curp, this.archivoSeleccionado).subscribe(
      response => {
        console.log('Imagen agregada correctamente a la prenda.');
        // Aquí puedes hacer lo que necesites después de subir la imagen
      },
      error => console.error('Error al subir la imagen a la prenda: ', error)
    );
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

  //PARA EL CRUD DE CLIENTES

  eliminarCliente(curp: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.clienteService.eliminarCliente(curp).subscribe({
      next: (datos) =>  {
        this.router.navigate(['/administracion/usuarios']).then(() => {
          this.obtenerClientes();
          this.alertMessage.show('Cliente Eliminado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
          console.log('cliente eliminado')
        });

      },
      error: (errores) => console.log(errores)
    });
    this.resetFormCliente();
    this.botonCerrarCliente.nativeElement.click();
  }

  private obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe(
      (datos => {
        this.clientes = datos;
      })
    );
    console.log(this.clientes)
  }

  cargarCliente(curp: string) {
    this.mdCliente = 'editar';
    this.cliente.curp = curp;
    this.clienteService.obtenerClientePorId(curp).subscribe(
      {
        next: (datos) => this.cliente = datos,
        error: (errores: any) => console.log(errores)
      }
    );
  }

  accionCliente(clienteForm: NgForm) {
    this.tabla = 'cliente'
    if (this.mdCliente === 'editar') {
      console.log('Editamos')
      this.editarCliente();
    } else {
      console.log('Nuevo cliente')
      this.agregarCliente();
    }
    //cerramos el modal
    this.resetFormCliente();
    this.botonCerrarCliente.nativeElement.click();

  }

  agregarCliente() {
    this.clienteService.agregarCliente(this.cliente).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerClientes();
            this.alertMessage.show('Cliente Agregado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('cliente agregado')
          });
          console.log(datos);

        },
        error: (error: any) => { console.log(error) }
      }
    );
    console.log('cliente agregado')
  }

  editarCliente() {
    console.log('entramos a guardar los cambios')
    this.clienteService.editarCliente(this.cliente.curp, this.cliente).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerClientes();
            this.alertMessage.show('Cliente Modificado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('cliente modificado')
          });
          console.log(datos);

        },
        error: (errores) => console.log(errores)
      }
    );
  }

  inicilizarDatosCliente() {
    this.mdCliente = 'agregar';
    this.cliente = new Cliente();
    this.cliente.curp = "";
    this.imagenUrl = "";
    this.previewUrl = "";
  }

  resetFormCliente() {
    this.clienteForm.resetForm();
    this.imagenUrl = "";
    this.previewUrl = "";

  }


  //PARA EL CRUD DE DEPARTAMENTOS

  obtenerDepartamentos() {
    this.departamentoService.obtenerDepartamentos().subscribe(
      (datos => {
        this.departamentos = datos;
      })
    );
    console.log(this.departamentos)
  }

  eliminarDepto(nombre: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.departamentoService.eliminarDepartamento(nombre).subscribe({
      next: (datos) => {
        this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerDepartamentos();
            this.alertMessage.show('Departamento Eliminado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('empleado modificado')
          });

      },
      error: (errores) => console.log(errores)
    });
    //cerramos el modal
    this.deptoForm.resetForm();
    this.botonCerrarDepto.nativeElement.click();
  }

  cargarDepto(nombre: string) {
    this.mdDepto = "editar";
    this.depto.nombre = nombre;
    this.departamentoService.obtenerDepartamentoPorId(nombre).subscribe(
      {
        next: (datos) => this.depto = datos,
        error: (errores: any) => console.log(errores)
      }
    );
  }

  accionDepartamento(deptoForm: NgForm) {
    //verificamos si vamos agregar o editar
    if (this.mdDepto === 'editar') {
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
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerDepartamentos();
            this.alertMessage.show('Departamento Agregado ', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('departamento agregado')
          });

        },
        error: (error: any) => { console.log(error) }
      }
    );
  }

  editarDepto() {
    console.log('entramos a guardar los cambios')
    this.departamentoService.editarDepartamento(this.depto.nombre, this.depto).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/usuarios']).then(() => {
            this.obtenerDepartamentos();
            this.alertMessage.show('Departamento Modificado', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('departamento modificado')
          });

        },
        error: (errores) => console.log(errores)
      }
    );
  }

  inicilizarDatosDepto() {
    this.mdDepto = "agregar"
    this.depto = new Departamento();
    this.depto.nombre = "";
  }

  resetFormDepto() {
    this.deptoForm.resetForm();
  }


}
