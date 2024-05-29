import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
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
import { ImgPrendaService } from '../../service/img-prenda.service';


@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [FormsModule, DatePipe
  ],
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

  imagenUrl: string; // Variable para almacenar la URL de la imagen
  // Define una variable para almacenar el archivo globalmente
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;
  
  today: string;

  constructor(private prendaService: PrendaService, 
    private ordenService: OrdenService,
    private empleadoService: EmpleadosService,
    private clienteService: ClientesService,
    private router: Router,
    private imgPrendaService : ImgPrendaService
  ){

    const todayDate = new Date();
    const day = String(todayDate.getDate()).padStart(2, '0');
    const month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = todayDate.getFullYear();
    this.today = `${year}-${month}-${day}`;
  }

  ngOnInit(){
    this.obtenerPrendas();
    this.obtenerOrdenes();
    
    this.inicializarDatosPrenda(); 
    this.inicializarDatosOrden();

    this.obtenerClientes();
    this.obtenerEmpleados();
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan en 0
    const dia = hoy.getDate().toString().padStart(2, '0');
    this.fechaMinima = `${hoy.getFullYear()}-${mes}-${dia}`;
  
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
      next: (datos) => {
        console.log('datos cambiados');
        if(this.archivoSeleccionado != null){
          this.subirImagenPrenda(this.prenda.idPrenda);
          console.log('imagen cambiada');
        }
      },
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
    this.imagenUrl = "";
  }

  inicializarDatosPrenda(){
    this.prenda.idPrenda = 0;
  }

  cargarPrenda(id: number){
    this.prenda.idPrenda = id;
    this.prendaService.obtenerPrendaPorId(id).subscribe(
      {
        next: (datos) => this.prenda = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(this.prenda.idPrenda)
    console.log("prenda: " + this.prenda.idPrenda)
    this.obtenerImagenPrenda(this.prenda.idPrenda);
    console.log('regresamos')
  }

  obtenerPrendas(){
    this.prendaService.obtenerPrendas().subscribe(
      (datos => {
        this.prendas = datos;
      })
    );
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
    }


      
      // reader.onload = () => {
      //   // No necesitas asignar la imagen a la propiedad logo de la prenda
      //   // this.prenda.logo = reader.result as ArrayBuffer;
      //   // Simplemente llama al método para subir la imagen
      //   //this.subirImagenPrenda(this.prenda.idPrenda);
      // };

      // reader.readAsArrayBuffer(this.archivoSeleccionado);
 }

  subirImagenPrenda(idPrenda: number): void {
    // Asegúrate de que la prenda tenga un ID válido
    if (!idPrenda) {
      console.error('La prenda no tiene un ID válido.');
      return;
    }

    // Llama al servicio para agregar la imagen a la prenda en la base de datos
    if(this.archivoSeleccionado == null){
      console.log('no se selecciono un archivo')
      return;
    }
    this.imgPrendaService.agregarImagenPrenda(idPrenda, this.archivoSeleccionado).subscribe(
      response => {
        console.log('Imagen agregada correctamente a la prenda.');
        // Aquí puedes hacer lo que necesites después de subir la imagen
      },
      error => console.error('Error al subir la imagen a la prenda: ', error)
    );
  }

  obtenerImagenPrenda(idPrenda: number): void {
    console.log('vamos a intentar ver la imagen')
    this.imgPrendaService.obtenerImagenPrenda(idPrenda).subscribe(
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

  // campo = { titulo: '' }; 

  // validarLabelNoVacio(textoLabel: string): boolean {
  //   return textoLabel.trim() !== ''; //return true si es vacio
  // }

  actualizarFecha(event: any) {
    const fechaSeleccionada = new Date(event.target.value);
    const año = fechaSeleccionada.getFullYear();
    const mes = (fechaSeleccionada.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan en 0
    const dia = fechaSeleccionada.getDate().toString().padStart(2, '0');
    this.fecha.fechaEntrega = `${año}, ${mes}, ${dia}`;
  }

  campo = { titulo: '' }; // Objeto prenda con propiedad titulo inicializada como cadena vacía
  campoVacio: boolean = false; // Propiedad para indicar si el campo está vacío

  validarCampoNoVacio(valor: string): void {
    this.campoVacio = valor.trim() === ''; // Actualizar estado del campo vacío en tiempo real
  }

  validarEtapa(textoLabel: string): boolean {
    return textoLabel.trim() !== 'diseño' && textoLabel.trim() !== 'corte' && textoLabel.trim() !== 'sublimacion';
}
validarEstado(textoLabel: string): boolean {
  return textoLabel.trim() !== 'En progreso' && textoLabel.trim() !== 'Pendiente' && textoLabel.trim() !== 'Terminado';
}
validarCantidades(cantidad: number): boolean {
  return cantidad > 12;
}
validarPrecio(cantidad: number): boolean {
  return cantidad > 0;
}

  validarFechas(){

  }
  validarCampos(){

  }

  fecha = { fechaEntrega: '' };
  fechaMinima: string;



}
