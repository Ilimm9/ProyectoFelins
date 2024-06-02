import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PrendaService } from '../../service/prenda.service';
import { OrdenService } from '../../service/orden.service';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { Prenda } from '../../models/prenda';
import { Orden } from '../../models/orden';
import { Empleado } from '../../models/empleado';
import { EmpleadosService } from '../../service/empleados.service';
import { Departamento } from '../../models/departamento';
import { EmpleadoLoggedService } from '../../service/empleado-logged.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  prendas: Prenda[]
  ordenes: Orden[]

  prenda: Prenda = new Prenda();
  orden: Orden = new Orden();

  clientes: Cliente[];
  empleados: Empleado[];
  departamentos: Departamento[]

  empleado: Empleado = new Empleado();


  @ViewChild("ordenForm") ordenForm: NgForm
  @ViewChild("botonCerrarOrden") btnCerrarOrden: ElementRef

  constructor(private prendaService: PrendaService,
    private empleadoService: EmpleadosService,
    private ordenService: OrdenService,
    private router: Router,
    private empleadoLoggedService: EmpleadoLoggedService
  ) {

  }

  ngOnInit() {
    this.obtenerEmpleados();

    this.obtenerOrdenes();
    this.orden.cliente = new Cliente();
    this.orden.prenda = new Prenda();
    this.orden.empleado = new Empleado();
  }
  
  accionOrden(ordenForm: NgForm) {
    if (this.orden.idOrden != 0) {
      //toca editar
      this.editarOrden();
    }
    //cerramos el modal
    this.ordenForm.resetForm();
    this.btnCerrarOrden.nativeElement.click();
  }

  // eliminarVistaOrden() {
  //   this.ordenService.agregarOrden(this.orden).subscribe(
  //     {
  //       next: (datos) => {
  //         this.router.navigate(['/diseño']);
  //       },
  //       error: (error: any) => { console.log(error) }
  //     }
  //   );
  //   console.log('orden agregada')
  // }

  editarOrden() {
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    this.router.navigate(['/diseño']).then(() => {
      this.obtenerOrdenes();
    })

  }

  // modificarStatus(id: number,) {
  //   this.orden.etapa = 'sublimacion'
  //   this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
  //     next: (datos) => console.log('realizado'),
  //     error: (errores) => console.log(errores)
  //   });
  //   window.location.reload();
  // }

  cargarOrden(id: number) {
    this.ordenService.obtenerOrdenPorId(id).subscribe(
      {
        next: (datos) => this.orden = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
  }

  obtenerOrdenes() {
    this.ordenService.obtenerOrdenes().subscribe(
      (datos => {
        this.ordenes = datos.filter((orden) => orden.estado.toLowerCase() === 'terminado');
        console.log(this.ordenes)
      })
    );
  }

  //para empleados

  activarEmpleado(curp: string) {
    this.empleado.curp = curp;
    this.empleadoService.obtenerEmpleadoPorId(curp).subscribe(
      {
        next: (datos) => {
          this.empleado = datos

          this.empleado.activo = true;
          this.empleadoService.editarEmpleado(this.empleado.curp, this.empleado).subscribe(
            {
              next: (datos) => {
                this.router.navigate(["/administracion/historial"]).then(() => {
                  this.obtenerEmpleados();
                })
                console.log('realizado')
              },
              error: (errores) => console.log(errores)
            }
          );

        },
        error: (errores: any) => console.log(errores)
      }
    );

  }


  obtenerEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe(
      (datos => {
        this.empleados = datos.filter((empleado) => empleado.activo === false);
      })
    );
    console.log(this.empleados);
  }

}
