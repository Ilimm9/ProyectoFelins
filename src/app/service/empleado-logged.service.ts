import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoLoggedService {

  private empleadoKey = 'empleado';
  private isLoginKey = 'isLogin';

  constructor() { }

  // Métodos para obtener los valores
  getEmpleado(): Empleado {
    const empleadoJson = localStorage.getItem(this.empleadoKey);
    return empleadoJson ? JSON.parse(empleadoJson) : null;
  }

  getIsLogin(): boolean {
    const isLogin = localStorage.getItem(this.isLoginKey);
    return isLogin ? JSON.parse(isLogin) : false;
  }

  // Métodos para actualizar los valores
  setEmpleado(empleado: Empleado): void {
    localStorage.setItem(this.empleadoKey, JSON.stringify(empleado));
  }

  setIsLogin(isLogin: boolean): void {
    localStorage.setItem(this.isLoginKey, JSON.stringify(isLogin));
  }

  // Método para limpiar la información al cerrar sesión
  clear(): void {
    localStorage.removeItem(this.empleadoKey);
    localStorage.removeItem(this.isLoginKey);
  }
}