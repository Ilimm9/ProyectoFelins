import { Component, ElementRef, ViewChild } from '@angular/core';
import { Inventario } from '../models/inventario';
import { InventarioService } from '../service/inventario.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Prenda } from '../models/prenda';
import { Orden } from '../models/orden';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { OrdenService } from '../service/orden.service';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {
  prendas: Prenda[]
  ordenes: Orden[]

  prenda: Prenda = new Prenda();
  orden: Orden = new Orden();

  clientes: Cliente[];
  empleados: Empleado[];

  materiales: Inventario[];
  material: Inventario = new Inventario();



  @ViewChild("prendaForm materialForm") prendaForm: NgForm
  @ViewChild("botonCerrarPrenda botonCerrarMaterial") btnCerrarPrenda: ElementRef

  @ViewChild("ordenForm") ordenForm: NgForm
  @ViewChild("botonCerrarOrden") btnCerrarOrden: ElementRef


  fileLoaded: boolean = false;





  constructor(private materialService: InventarioService,
    private router: Router,
    private ordenService: OrdenService
    
  ){}


  

  ngOnInit() {
    this.obtenerMateriales();
    this.inicializarDatosMaterial();
    this.obtenerOrdenes();
    this.orden.cliente = new Cliente();
    this.orden.prenda = new Prenda();
  }

  //metodos para manipulacion de las prendas

  eliminarMaterial(id: number){
    this.materialService.eliminarMaterial(id).subscribe({
      next: (datos) => this.obtenerMateriales(),
      error: (errores) => console.log(errores)
    });
  }

  accionMaterial(prendaForm: NgForm){
    if(this.material.idMaterial != 0){
      //toca editar
      this.editarMaterial();
    } else {
      this.agregarMaterial();
    }
    //cerramos el modal
    this.prendaForm.resetForm();
    this.btnCerrarPrenda.nativeElement.click();
  }

  agregarMaterial(){
    this.materialService.agregarMaterial(this.material).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['/almacen']);
        },
        error: (error: any) => {console.log(error)}
      }
    );
    console.log('material agregado')
  }

  editarMaterial(){
    this.materialService.editarMaterial(this.material.idMaterial, this.material).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    this.router.navigate(['/almacen']).then(() => {
      // window.location.reload();
      this.obtenerMateriales();
    })

  }

  limpiarDatosMaterial(){
    this.material = new Inventario();
    this.inicializarDatosMaterial();
  }

  inicializarDatosMaterial(){
    this.material.idMaterial = 0;
  }

  cargarMaterial(id: number){
    this.materialService.obtenerMaterialPorId(id).subscribe(
      {
        next: (datos) => this.material = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(id)
  }
  obtenerMateriales(){
    this.materialService.obtenerMateriales().subscribe(
      (datos => {
        this.materiales = datos;
      })
    );
    console.log(this.materiales)
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
        this.router.navigate(['/confeccion']);
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
  this.router.navigate(['/confeccion']).then(() => {
    this.obtenerOrdenes();
  })

}

modificarStatus(id: number, ){
  this.orden.etapa='terminado'
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
      this.ordenes = datos.filter((orden)=>orden.etapa === 'almacen');
    console.log(this.ordenes)
    })
  );
}



 onFileChange(event: any) {
  const file = event.target.files[0];
if (file) {
this.fileLoaded = true;
  }
}
entregar() {
if (this.orden.idOrden) { 
    this.modificarStatus(this.orden.idOrden);
}
 }

}
