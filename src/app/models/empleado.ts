import { Departamento } from "./departamento";
import { Usuario } from "./usuario";

export class Empleado extends Usuario{
    usuario: string
    password: string
    fechaAlta: Date
    activo: boolean
    departamentos: Departamento[] = [];

    obtenerNombresDepartamentos(): string {
        // Utilizamos map para obtener un array de nombres de departamentos
        const nombres: string[] = this.departamentos.map((depto: Departamento) => depto.nombre);
        // Usamos join para unir los nombres con '|'
        return nombres.join(' | ');
    }
}