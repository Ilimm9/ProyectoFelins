import { Component, ElementRef, ViewChild} from '@angular/core';
import { Prenda } from '../models/prenda';
import { Orden } from '../models/orden';
import { Cliente } from '../models/cliente';
import { Empleado } from '../models/empleado';
import { FormsModule, NgForm } from '@angular/forms';
import { PrendaService } from '../service/prenda.service';
import { OrdenService } from '../service/orden.service';
import { Router } from '@angular/router';
import { ImgPrendaService } from '../service/img-prenda.service';


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



  fileLoaded: boolean = false;

  imagenUrl: string; // Variable para almacenar la URL de la imagen
  // Define una variable para almacenar el archivo globalmente
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;



  constructor(private prendaService: PrendaService, 
    private ordenService: OrdenService,
    private router: Router,
    private imgPrendaService : ImgPrendaService
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
        this.ordenes = datos.filter((orden)=>orden.etapa === 'diseño');
      console.log(this.ordenes)
      })
    );
  }

  

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.fileLoaded = true;
  //   }
  // }
  // entregar() {
  //   if (this.orden.idOrden) { 
  //     this.subirImagenPrenda(this.orden.idOrden )
  //     this.modificarStatus(this.orden.idOrden);
  //   }
  // }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileLoaded = true;
      this.previewUrl = URL.createObjectURL(file);
    } else {
      this.fileLoaded = false;
      this.previewUrl = null;
    }
  }

  entregar(): void {
    if (this.orden.idOrden) {
      this.subirImagenPrenda(this.orden.idOrden);
      this.modificarStatus(this.orden.idOrden);
    }
  }

  subirImagenPrenda(idPrenda: number): void {
    if (!idPrenda) {
      console.error('La prenda no tiene un ID válido.');
      return ;
    }

    if(this.archivoSeleccionado == null){
      console.log('no se selecciono un archivo')
      return ;
    }
    this.imgPrendaService.agregarImagenPrenda(idPrenda, this.archivoSeleccionado).subscribe(
      response => {
        console.log('Imagen agregada correctamente a la prenda.');
        // Aquí puedes hacer lo que necesites después de subir la imagen
      },
      error => console.error('Error al subir la imagen a la prenda: ', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      
      // Generar una URL de vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.fileLoaded = true; // Indica que se ha cargado un archivo
      };
      reader.readAsDataURL(this.archivoSeleccionado);
    }
  }

  modificarStatus(id: number, ){
    this.orden.estado='pendiente'
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => console.log('terminado'),
      error: (errores) => console.log(errores)
    });
    window.location.reload();
  }


}
