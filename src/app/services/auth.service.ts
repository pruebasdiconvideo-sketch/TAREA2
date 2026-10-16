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
const CLAVE_USUARIOS_NUEVOS = 'cafe_andino_usuarios_nuevos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sesion: SesionUsuario | null = null;
  private sesionCambioSubject = new Subject<SesionUsuario | null>();
  readonly sesionCambio$ = this.sesionCambioSubject.asObservable();

  private readonly usuariosPredefinidos: Usuario[] = [
    { id: 1, nombre: 'Administrador', email: 'admin@cafeandino.pe', password: '1234', rol: 'administrador' },
    { id: 2, nombre: 'Lucía Quispe', email: 'cliente@cafeandino.pe', password: '1234', rol: 'cliente' },
    { id: 3, nombre: 'Carlos Mamani', email: 'carlos@ejemplo.com', password: '1234', rol: 'cliente' },
  ];

  constructor() {
    this.sesion = this.leerSesion();
  }

  iniciarSesion(email: string, password: string): Observable<boolean> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuarios = [...this.usuariosPredefinidos, ...this.leerUsuariosNuevos()];
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === emailNormalizado && u.password === password,
    );
    if (!usuario) return of(false);
    this.guardarSesion(usuario);
    return of(true);
  }

  registrarCliente(nombre: string, email: string, password: string): Observable<boolean> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuarios = [...this.usuariosPredefinidos, ...this.leerUsuariosNuevos()];
    if (usuarios.some((u) => u.email.toLowerCase() === emailNormalizado)) {
      return of(false);
    }
    const nuevo: Usuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      email: emailNormalizado,
      password,
      rol: 'cliente',
    };
    this.guardarUsuarioNuevo(nuevo);
    this.guardarSesion(nuevo);
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

  private leerUsuariosNuevos(): Usuario[] {
    try {
      const guardados = localStorage.getItem(CLAVE_USUARIOS_NUEVOS);
      return guardados ? (JSON.parse(guardados) as Usuario[]) : [];
    } catch {
      return [];
    }
  }

  private guardarUsuarioNuevo(usuario: Usuario): void {
    const usuarios = this.leerUsuariosNuevos();
    usuarios.push(usuario);
    localStorage.setItem(CLAVE_USUARIOS_NUEVOS, JSON.stringify(usuarios));
  }
}
