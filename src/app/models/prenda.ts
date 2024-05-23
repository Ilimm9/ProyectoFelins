export class Prenda {
    idPrenda: number;
    titulo: string;
    descripcion: string;
    cantidad : number;
    precio: number;
    observaciones: string;
    logo: ArrayBuffer | null = null; // Inicializamos como null, ya que podríamos no tener datos en un principio
    resultado: ArrayBuffer | null = null;
}