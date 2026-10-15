import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

export interface SesionUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'administrador' | 'cliente';
  fechaIngreso: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'administrador' | 'cliente';
}

const CLAVE_SESION = 'cafe_andino_sesion';

/**
 * Servicio de autenticación con localStorage.
 * Estilo del profesor: métodos directos, sin signals.
 *
 * Los usuarios están predefinidos localmente (no requiere JSON Server).
 * JSON Server solo se usa para pedidos (no para login).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sesion: SesionUsuario | null = null;
  private sesionCambioSubject = new Subject<SesionUsuario | null>();
  readonly sesionCambio$ = this.sesionCambioSubject.asObservable();

  // Usuarios predefinidos — los mismos 3 del db.json.
  private readonly usuarios: Usuario[] = [
    { id: 1, nombre: 'Administrador', email: 'admin@cafeandino.pe', password: '1234', rol: 'administrador' },
    { id: 2, nombre: 'Lucía Quispe', email: 'cliente@cafeandino.pe', password: '1234', rol: 'cliente' },
    { id: 3, nombre: 'Carlos Mamani', email: 'carlos@ejemplo.com', password: '1234', rol: 'cliente' },
  ];

  constructor() {
    this.sesion = this.leerSesion();
  }

  /**
   * Valida credenciales contra los usuarios predefinidos.
   * No requiere JSON Server.
   */
  iniciarSesion(email: string, password: string): Observable<boolean> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario = this.usuarios.find(
      (u) => u.email.toLowerCase() === emailNormalizado && u.password === password,
    );
    if (!usuario) return of(false);
    this.guardarSesion(usuario);
    return of(true);
  }

  private guardarSesion(usuario: Usuario): void {
    const sesion: SesionUsuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fechaIngreso: new Date().toISOString(),
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.sesion = sesion;
    this.sesionCambioSubject.next(this.sesion);
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_SESION);
    this.sesion = null;
    this.sesionCambioSubject.next(this.sesion);
  }

  estaAutenticado(): boolean {
    return this.sesion !== null;
  }

  esAdministrador(): boolean {
    return this.sesion?.rol === 'administrador';
  }

  obtenerSesion(): SesionUsuario | null {
    return this.sesion;
  }

  private leerSesion(): SesionUsuario | null {
    try {
      const guardada = localStorage.getItem(CLAVE_SESION);
      return guardada ? (JSON.parse(guardada) as SesionUsuario) : null;
    } catch {
      return null;
    }
  }
}
