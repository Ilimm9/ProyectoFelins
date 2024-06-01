import { Empleado } from "./empleado"
import { Inventario } from "./inventario"

export class MovimientoInventario {
    clave: string;
    inventario: Inventario;
    empleado: Empleado;
    fechaMov: Date;
    tipoMov: string;
    cantidadMov: number;
    razon: string; 
}
