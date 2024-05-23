import { Component, ElementRef, ViewChild } from '@angular/core';
import { Prenda } from '../../models/prenda';
import { Orden } from '../../models/orden';
import { PrendaService } from '../../service/prenda.service';
import { OrdenService } from '../../service/orden.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent {

  prendas: Prenda[]
  ordenes: Orden[]

  prenda: Prenda = new Prenda();
  orden: Orden = new Orden();

  @ViewChild("prendaForm") prendaForm: NgForm
  @ViewChild("botonCerrarPrenda") btnCerrarPrenda: ElementRef

  constructor(private prendaService: PrendaService, 
    private ordenService: OrdenService,
    private router: Router
  ){

  }

  ngOnInit(){
    this.obtenerPrendas();
    this.obtenerOrdenes();

    this.inicializarDatosPrenda(); 
  }
  
  //metodos para manipulacion de las prendas

  accionPrenda(prendaForm: NgForm){
    if(this.prenda.idPrenda != 0){
      //toca editar
      this.editarPrenda();
    }
    //cerramos el modal
    this.prendaForm.resetForm();
    this.btnCerrarPrenda.nativeElement.click();
  }

  editarPrenda(){
    this.prendaService.editarPrenda(this.prenda.idPrenda, this.prenda).subscribe({
      next: (datos) => console.log('realizado'),
      error: (errores) => console.log(errores)
    });
    this.router.navigate(['/administracion/ordenes']).then(() => {
      window.location.reload();
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

  //metodos para manipulacion de las ordenes

  obtenerOrdenes(){
    this.ordenService.obtenerOrdenes().subscribe(
      (datos => {
        this.ordenes = datos;
      })
    );
  }


}
