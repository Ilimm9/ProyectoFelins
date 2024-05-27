import { Component, ElementRef, ViewChild} from '@angular/core';
import { Prenda } from '../models/prenda';
import { Orden } from '../models/orden';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { FormsModule, NgForm } from '@angular/forms';
import { PrendaService } from '../service/prenda.service';
import { OrdenService } from '../service/orden.service';
import { EmpleadosService } from '../service/empleados.service';
import { ClientesService } from '../service/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disenio',
  standalone: true,

  imports: [FormsModule],
  templateUrl: './disenio.component.html',
  styleUrl: './disenio.component.css'
})
export class DisenioComponent {
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
        this.ordenes = datos.filter((orden)=>orden.etapa === 'Diseño');
      console.log(this.ordenes)
      })
    );
  }

  
  fileLoaded: boolean = false;

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
