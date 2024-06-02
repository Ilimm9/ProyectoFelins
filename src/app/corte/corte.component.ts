
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Prenda } from '../models/prenda';
import { Orden } from '../models/orden';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { PrendaService } from '../service/prenda.service';
import { OrdenService } from '../service/orden.service';
import { Router } from '@angular/router';
import { MovimientosComponent } from '../movimientos/movimientos.component';
import { EmpleadoLoggedService } from '../service/empleado-logged.service';
@Component({
  selector: 'app-corte',
  standalone: true,
  imports: [FormsModule, MovimientosComponent],
  templateUrl: './corte.component.html',
  styleUrl: './corte.component.css',
})
export class CorteComponent   {

  prendas: Prenda[]
  ordenes: Orden[]

  prenda: Prenda = new Prenda();
  orden: Orden = new Orden();

  clientes: Cliente[];
  empleados: Empleado[];


  @ViewChild("prendaForm") prendaForm: NgForm
  @ViewChild("botonCerrarPrenda") btnCerrarPrenda: ElementRef

  @ViewChild("ordenForm") ordenForm: NgForm
  @ViewChild("botonCerrarOrden") btnCerrarOrden: ElementRef

  constructor(private prendaService: PrendaService, 
    private ordenService: OrdenService,
    private router: Router,
    private empleadoLoggedService: EmpleadoLoggedService,
  ){

  }

  ngOnInit(){
    this.obtenerOrdenes();
    this.orden.cliente = new Cliente();
    this.orden.prenda = new Prenda();
    this.orden.empleado = new Empleado();
  }


  accionOrden(ordenForm: NgForm){
    if(this.orden.idOrden != 0){
      //toca editar
      this.editarOrden();
    } 
    //cerramos el modal
    this.ordenForm.resetForm();
    this.btnCerrarOrden.nativeElement.click();
  }

  // eliminarVistaOrden(){
  //   this.ordenService.agregarOrden(this.orden).subscribe(
  //     {
  //       next: (datos) => {
  //         this.router.navigate(['/diseño']);
  //       },
  //       error: (error: any) => {console.log(error)}
  //     }
  //   );
  //   console.log('orden agregada')
  // }

  editarOrden(){
    this.orden.etapa = 'Sublimacion'
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => {
        this.router.navigate(['fase/' + this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase()]).then(() => {
          this.obtenerOrdenes();
        })
        console.log('realizado')
      },
      error: (errores) => console.log(errores)
    });
    // this.router.navigate(['/diseño']).then(() => {
    //   this.obtenerOrdenes();
    // })

  }

  // modificarEtapa(){
  //   this.orden.etapa='sublimacion'
  //   this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
  //     next: (datos) => console.log('realizado'),
  //     error: (errores) => console.log(errores)
  //   });
  //   window.location.reload();
  // }

  cargarOrden(id: number){
    this.ordenService.obtenerOrdenPorId(id).subscribe(
      {
        next: (datos) => this.orden = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
  }
  
  obtenerOrdenes(){
    this.ordenService.obtenerOrdenes().subscribe(
      (datos => {
        this.ordenes = datos.filter((orden)=>orden.etapa.toLowerCase() === 'corte');
      console.log(this.ordenes)
      })
    );
  }

  // modificarEtapa(id: number) {
  //   // this.cargarOrden(id)  
  //   // Verificar si this.orden está definido y si this.orden.etapa tiene un valor válido
  //   if (this.orden.etapa.toLowerCase() === 'corte') {
  //     // Cambiar el estado a "Sublimación"
  //     this.orden.etapa = 'Sublimacion';
  
  //     this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
  //       next: (datos) => {
  //         console.log('La etapa ha sido modificada a Sublimación');
  //         // Recargar la página después de editar la orden
  //         window.location.reload();
  //       },
  //       error: (errores) => console.log('Error al modificar la etapa:', errores)
  //     });
  //   } else {
  //     // Si this.orden o this.orden.etapa no son válidos, imprimir un mensaje de error
  //     console.log('No se puede cambiar la etapa porque this.orden.etapa no es válido o no es Diseño.');
  //   }

  // }
  

}

