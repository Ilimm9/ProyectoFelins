import { Cliente } from "./cliente";
import { Empleado } from "./empleado";
import { Prenda } from "./prenda";

export class Orden {
    idOrden: number;
    cliente: Cliente;
    empleado: Empleado;
    prenda: Prenda;
    fechaInicio: Date;
    fechaEntrega: Date;
    etapa: string; //disenio, corte, sublimacion, confeccion, almacen
    estado: string; //pendiente, en proceso, pausa, terminado
    total : number; 
    anticipo: number;
}