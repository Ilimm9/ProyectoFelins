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
import { EmpleadoLoggedService } from '../service/empleado-logged.service';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [FormsModule, AlertMessagesModule],
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

  mdMaterial: string = 'agregar'
  tabla: string = ''

  @ViewChild("materialForm") materialForm: NgForm
  @ViewChild("botonCerrarMaterial") botonCerrarMaterial: ElementRef

  @ViewChild("ordenForm") ordenForm: NgForm
  @ViewChild("botonCerrarOrden") btnCerrarOrden: ElementRef


  fileLoaded: boolean = false;

  constructor(private materialService: InventarioService,
    private router: Router,
    private ordenService: OrdenService,
    private alertMessage: AlertMessagesService,
    private empleadoLoggedService: EmpleadoLoggedService
  ) { }

  ngOnInit() {
    this.obtenerMateriales();
    this.inicializarDatosMaterial();
    this.obtenerOrdenes();
    this.orden.cliente = new Cliente();
    this.orden.prenda = new Prenda();
  }

  //metodos para manipulacion de los materiales

  eliminarMaterial(codigo: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.materialService.eliminarMaterial(codigo).subscribe({
      next: (datos) => {
        this.router.navigate(['fase/' + this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase()]).then(() => {
          this.obtenerMateriales();
          this.alertMessage.show('Material Eliminado Exitosamente!!!', { cssClass: 'alert alert-success', timeOut: 3000 })
          console.log('material eliminado')
        });
      },
      error: (errores) => console.log(errores)
    });
    //cerramos el modal
    this.materialForm.resetForm();
    this.botonCerrarMaterial.nativeElement.click();
  }

  accionMaterial(prendaForm: NgForm) {
    this.tabla = 'material';
    if (this.mdMaterial === "editar") {
      //toca editar
      this.editarMaterial();
    } else {
      this.agregarMaterial();
    }
    //cerramos el modal
    this.materialForm.resetForm();
    this.botonCerrarMaterial.nativeElement.click();
  }

  agregarMaterial() {
    this.materialService.agregarMaterial(this.material).subscribe(
      {
        next: (datos) => {
          this.router.navigate(['fase/' + this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase()]).then(() => {
            this.obtenerMateriales();
            this.alertMessage.show('Material Agregado', { cssClass: 'alert alert-success', timeOut: 3000 })
            console.log('material agregado')
          });
          console.log(datos);
        },
        error: (error: any) => { console.log(error) }
      }
    );
  }

  editarMaterial() {

    this.materialService.editarMaterial(this.material.codigo, this.material).subscribe({
      next: (datos) => {
        this.router.navigate(['fase/' + this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase()]).then(() => {
          this.obtenerMateriales();
          this.alertMessage.show('Material Editado', { cssClass: 'alert alert-success', timeOut: 3000 })
          console.log('material modificado')
        })
        console.log(datos);
      },
      error: (errores) => console.log(errores)
    });

  }

  inicializarDatosMaterial() {
    this.mdMaterial = 'agregar'
    this.material = new Inventario();
    this.material.codigo = '';
  }

  cargarMaterial(codigo: string) {
    this.mdMaterial = 'editar';
    this.materialService.obtenerMaterialPorId(codigo).subscribe(
      {
        next: (datos) => this.material = datos,
        error: (errores: any) => console.log(errores)
      }
    );
    console.log(codigo)
  }
  obtenerMateriales() {
    this.materialService.obtenerMateriales().subscribe(
      (datos => {
        this.materiales = datos.filter(mat => mat.cantidad > 0);
      })
    );
    console.log(this.materiales)
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
  //         this.router.navigate(['/confeccion']);
  //       },
  //       error: (error: any) => { console.log(error) }
  //     }
  //   );
  //   console.log('orden agregada')
  // }

  editarOrden() {
    this.orden.estado = 'Terminado'
    this.orden.etapa = 'Terminado'
    this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
      next: (datos) => {
        this.router.navigate(['fase/' + this.empleadoLoggedService.getEmpleado().departamento.nombre.toLowerCase()]).then(() => {
          this.obtenerOrdenes();
        })
        console.log('realizado')
      },
      error: (errores) => console.log(errores)
    });

  }

  // modificarStatus(id: number,) {
  //   this.orden.estado = 'terminado'
  //   this.orden.etapa = 'terminado'
  //   this.ordenService.editarOrden(this.orden.idOrden, this.orden).subscribe({
  //     next: (datos) => console.log('realizado'),
  //     error: (errores) => console.log(errores)
  //   });
  //   // this.modificarEtapa(id);
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
        this.ordenes = datos.filter((orden) => orden.etapa.toLowerCase() === 'almacen');
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
  // entregar() {
  //   if (this.orden.idOrden) {
  //     this.modificarStatus(this.orden.idOrden);
  //   }
  // }

  // modificarEtapa(id: number) {
  //   // this.cargarOrden(id)  
  //   // Verificar si this.orden está definido y si this.orden.etapa tiene un valor válido
  //   if (this.orden.etapa.toLowerCase() === 'Almacen') {
  //     // Cambiar el estado a "Sublimación"
  //     this.orden.etapa = 'Terminado';

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
