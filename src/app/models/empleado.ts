import { Departamento } from "./departamento";
import { Usuario } from "./usuario";

export class Empleado extends Usuario{
    usuario: string
    password: string
    fechaAlta: Date
    activo: boolean
    departamento: Departamento


}