import { Component, ElementRef, ViewChild } from '@angular/core';
import { Inventario } from '../models/inventario';
import { InventarioService } from '../service/inventario.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {
  materiales: Inventario[];
  material: Inventario = new Inventario();

  @ViewChild("materialForm") prendaForm: NgForm
  @ViewChild("botonCerrarMaterial") btnCerrarPrenda: ElementRef

  constructor(private materialService: InventarioService,
    private router: Router
  ){}

  ngOnInit() {
    this.obtenerMateriales();
    this.inicializarDatosMaterial();
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


}
