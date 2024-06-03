import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { MovimientoInventario } from '../models/movimiento-inventario';
import { FormsModule, NgForm } from '@angular/forms';
import { Inventario } from '../models/inventario';
import { InventarioService } from '../service/inventario.service';
import { EmpleadoLoggedService } from '../service/empleado-logged.service';
import { MovimientoService } from '../service/movimiento.service';
import { Route, Router } from '@angular/router';
import { mergeMap, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Empleado } from '../models/empleado';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.css',
})
export class MovimientosComponent {
  inventarios: Inventario[];
  inventario: Inventario = new Inventario();

  movimiento: MovimientoInventario = new MovimientoInventario();

  movimientos: MovimientoInventario[];

  @ViewChild('botonCerrarSolicitud') botonCerrarSolicitud: ElementRef;
  @ViewChild('solicitudForm') solicitudForm: NgForm;
  @ViewChild('botonCerrarConfirmacion') botonCerrarConfirmacion: ElementRef;
  @ViewChild('confrimacionForm') confrimacionForm: NgForm;

  constructor(
    private materialService: InventarioService,
    private empleadoLogged: EmpleadoLoggedService,
    private movimientoService: MovimientoService,
    private router: Router
  ) {}
  ngOnInit() {
    this.obtenerMovimientos();
    this.obtenerInventarios();
    // this.orden.cliente = new Cliente();
    // this.orden.prenda = new Prenda();
    this.movimiento.empleado = new Empleado();
    this.movimiento.inventario = new Inventario();
  }

  obtenerInventarios() {
    this.materialService.obtenerMateriales().subscribe((datos) => {
      this.inventarios = datos;
    });
  }

  obtenerMovimientos() {
    this.movimientoService.obtenerMovimiento().subscribe((datos) => {
      this.movimientos = datos.filter(mov=>mov.empleado.curp===this.empleadoLogged.getEmpleado().curp);
    });
  }

  cargarMovimiento(codigo: string) {
    this.movimientoService.obtenerMovimientoPorId(codigo).subscribe({
      next: (datos) => {
        this.movimiento = datos;
        // this.editar(cadena);
      },
      error: (errores: any) => console.log(errores),
    });
    // window.location.reload();
  }

  cargarDatos(clave: string, codigo: string) {
    this.cargarMaterial(codigo);
    this.cargarMovimiento(clave);
  }

  cargarMaterial(clave: string) {
    this.materialService.obtenerMaterialPorId(clave).subscribe({
      next: (datos) => {
        this.inventario = datos;
      },
      error: (errores: any) => console.log(errores),
    });
  }

  editarMaterial() {
    if(this.inventario.cantidad>= this.movimiento.cantidadMov){
    this.inventario.cantidad -= this.movimiento.cantidadMov;
    
    this.materialService
      .editarMaterial(this.inventario.codigo, this.inventario)
      .subscribe({
        next: (datos) => {
          this.router.navigate([
            'fase/' +
              this.empleadoLogged
                .getEmpleado()
                .departamento.nombre.toLowerCase(),
          ]);
          this.editarMovimiento('Aceptada');
        },
        error: (errores) => console.log(errores),
      });
    }else{
      this.editarMovimiento('En espera')
    }
    this.botonCerrarConfirmacion.nativeElement.click();
    this.confrimacionForm.resetForm();
    window.location.reload();

  }

  cancelar(cadena: string) {
    this.movimientoService.obtenerMovimientoPorId(cadena).subscribe({
      next: (datos) => {
        this.movimiento = datos;
        this.movimiento.estado = 'Cancelada';
        this.editar(cadena);
      },
      error: (errores: any) => console.log(errores),
    });
    // window.location.reload();
  }

  editarMovimiento(cadena: string) {
    this.movimiento.inventario = this.inventario;
    console.log(cadena)
    this.movimiento.estado = cadena;
    console.log(this.movimiento)

    this.movimientoService
      .editarMovimiento(this.movimiento.clave, this.movimiento)
      .subscribe({
        next: (datos) => {
          this.router
            .navigate([
              'fase/' +
                this.empleadoLogged
                  .getEmpleado()
                  .departamento.nombre.toLowerCase(),
            ])
            .then(() => {
              this.obtenerInventarios();
            });
        },

        error: (errores: any) => console.log(errores),
      });
  }

  editar(cadena: string) {
    this.movimientoService.editarMovimiento(cadena, this.movimiento).subscribe({
      next: (datos) => {
        this.router
          .navigate([
            'fase/' +
              this.empleadoLogged
                .getEmpleado()
                .departamento.nombre.toLowerCase(),
          ])
          .then(() => {
            this.obtenerInventarios();
          });
      },
      error: (errores: any) => console.log(errores),
    });
  }
  accionMovimiento() {
    this.movimiento.empleado = this.empleadoLogged.getEmpleado();
    this.movimiento.tipoMov = 'salida';
    this.movimiento.estado = 'pendiente';

    this.movimientoService.agregarMovimiento(this.movimiento).subscribe({
      next: (datos) => {
        this.router
          .navigate([
            'fase/' +
              this.empleadoLogged
                .getEmpleado()
                .departamento.nombre.toLowerCase(),
          ])
          .then(() => {
            this.obtenerInventarios();
          });
        console.log('realizado');
      },
      error: (errores) => console.log(errores),
    });
    this.solicitudForm.resetForm();
    this.botonCerrarSolicitud.nativeElement.click();
    // window.location.reload();
  }

  EmpleadoAlmacen(): boolean {
    return this.empleadoLogged.getEmpleado().departamento.nombre == 'Almacen'
      ? true
      : false;
  }
}
