import { Component, ElementRef, ViewChild } from '@angular/core';
import { Prenda } from '../../models/prenda';
import { Orden } from '../../models/orden';
import { PrendaService } from '../../service/prenda.service';
import { OrdenService } from '../../service/orden.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente';
import { Empleado } from '../../models/empleado';
import { EmpleadosService } from '../../service/empleados.service';
import { ClientesService } from '../../service/clientes.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [FormsModule, DatePipe ],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent {

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
    private empleadoService: EmpleadosService,
    private clienteService: ClientesService,
    private router: Router
  ){

  }

  ngOnInit(){
    this.obtenerPrendas();
    this.obtenerOrdenes();
    
    this.inicializarDatosPrenda(); 
    this.inicializarDatosOrden();

    this.obtenerClientes();
    this.obtenerEmpleados();
  }

  obtenerEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe(
      (datos => {
        this.empleados = datos;
      })
    );
    console.log(this.empleados);
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe(
      (datos => {
        this.clientes = datos;
      })
    );
    console.log(this.clientes)
  }
  
  //metodos para manipulacion de las prendas

  eliminarPrenda(id: number){
    this.prendaService.eliminarPrenda(id).subscribe({
      next: (datos) => this.obtenerPrendas(),
      error: (errores) => console.log(errores)
    });
  }

  accionPrenda(prendaForm: NgForm){
    if(this.prenda.idPrenda != 0){
      //toca editar
      this.editarPrenda();
    } else {
      this.agregarPrenda();
    }
    //cerramos el modal
    this.prendaForm.resetForm();
    this.btnCerrarPrenda.nativeElement.click();
  }

  agregarPrenda(){
    this.prendaService.agregarPrenda(this.prenda).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/ordenes']);
        },
        error: (error: any) => {console.log(error)}
      }
    );
    console.log('prenda agregado')
  }

  editarPrenda(){
    this.prendaService.editarPrenda(this.prenda.idPrenda, this.prenda).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    this.router.navigate(['/administracion/ordenes']).then(() => {
      // window.location.reload();
      this.obtenerPrendas();
    })

  }

  limpiarDatosPrenda(){
    this.prenda = new Prenda();
    this.inicializarDatosPrenda();
  }

  inicializarDatosPrenda(){
    this.prenda.idPrenda = 0;
  }

  cargarPrenda(id: number){
    this.prendaService.obtenerPrendaPorId(id).subscribe(
      {
        next: (datos) => this.prenda = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
  }
  obtenerPrendas(){
    this.prendaService.obtenerPrendas().subscribe(
      (datos => {
        this.prendas = datos;
      })
    );
    console.log(this.prendas)
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.prenda.logo = reader.result as ArrayBuffer;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  //metodos para manipulacion de las ordenes

  eliminarOrden(id: number){
    this.ordenService.eliminarOrden(id).subscribe({
      next: (datos) => this.obtenerOrdenes(),
      error: (errores) => console.log(errores)
    });
  }

  accionOrden(ordenForm: NgForm){
    if(this.orden.idOrden != 0){
      //toca editar
      this.editarOrden();
    } else {
      this.agregarOrden();
    }
    //cerramos el modal
    this.ordenForm.resetForm();
    this.btnCerrarOrden.nativeElement.click();
  }

  agregarOrden(){
    this.ordenService.agregarOrden(this.orden).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/administracion/ordenes']);
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
    this.router.navigate(['/administracion/ordenes']).then(() => {
      // window.location.reload();
      this.obtenerOrdenes();
    })

  }

  limpiarDatosOrden(){
    this.orden = new Orden();
    this.inicializarDatosOrden();
  }

  inicializarDatosOrden(){
    this.orden.idOrden = 0;
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
        this.ordenes = datos;
      })
    );
  }

  yaEstaEnOrden(prenda: Prenda): boolean{
    for( let p of this.ordenes){
      if(p.prenda.idPrenda == prenda.idPrenda){
        return true;
      }
    }
    return false;
  }

  
  


}
