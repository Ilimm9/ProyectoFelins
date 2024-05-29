import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PrendaService } from '../../service/prenda.service';
import { OrdenService } from '../../service/orden.service';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { Prenda } from '../../models/prenda';
import { Orden } from '../../models/orden';
import { Empleado } from '../../models/empleado';

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


  @ViewChild("prendaForm") prendaForm: NgForm
  @ViewChild("botonCerrarPrenda") btnCerrarPrenda: ElementRef

  @ViewChild("ordenForm") ordenForm: NgForm
  @ViewChild("botonCerrarOrden") btnCerrarOrden: ElementRef

  constructor(private prendaService: PrendaService, 
    private ordenService: OrdenService,
    private router: Router
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

  eliminarVistaOrden(){
    this.ordenService.agregarOrden(this.orden).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/diseño']);
        },
        error: (error: any) => {console.log(error)}
      }
    );
    console.log('orden agregada')
  }

  editarOrden(){
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    this.router.navigate(['/diseño']).then(() => {
      this.obtenerOrdenes();
    })

  }

  modificarStatus(id: number, ){
    this.orden.etapa='sublimacion'
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    window.location.reload();
  }

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
        this.ordenes = datos.filter((orden)=>orden.etapa === 'Terminado');
      console.log(this.ordenes)
      })
    );
  }


}
