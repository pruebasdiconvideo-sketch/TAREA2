import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
 * Estilo del profesor: constructor con HttpClient, métodos directos, sin signals.
 *
 * Estrategia: intenta validar contra JSON Server; si no responde (red, CORS,
 * deploy en Netlify sin backend), usa los usuarios locales predefinidos.
 * El login SIEMPRE funciona.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private sesion: SesionUsuario | null = null;
  private sesionCambioSubject = new Subject<SesionUsuario | null>();
  readonly sesionCambio$ = this.sesionCambioSubject.asObservable();

  // Usuarios predefinidos (fallback cuando JSON Server no está disponible).
  // Son los mismos 3 usuarios del db.json.
  private readonly usuariosLocales: Usuario[] = [
    { id: 1, nombre: 'Administrador', email: 'admin@cafeandino.pe', password: '1234', rol: 'administrador' },
    { id: 2, nombre: 'Lucía Quispe', email: 'cliente@cafeandino.pe', password: '1234', rol: 'cliente' },
    { id: 3, nombre: 'Carlos Mamani', email: 'carlos@ejemplo.com', password: '1234', rol: 'cliente' },
  ];

  constructor(private http: HttpClient) {
    this.sesion = this.leerSesion();
  }

  /**
   * Valida credenciales. Intenta primero contra JSON Server;
   * si falla la red, usa los usuarios locales predefinidos.
   */
  iniciarSesion(email: string, password: string): Observable<boolean> {
    const emailNormalizado = email.trim().toLowerCase();
    return this.http
      .get<Usuario[]>(`${this.apiUrl}?email=${encodeURIComponent(emailNormalizado)}`)
      .pipe(
        map((usuarios) => {
          const usuario = usuarios.find((u) => u.password === password);
          if (!usuario) return false;
          this.guardarSesion(usuario);
          return true;
        }),
        // Si JSON Server no responde (red/CORS), usar usuarios locales
        catchError(() => {
          const usuario = this.usuariosLocales.find(
            (u) => u.email.toLowerCase() === emailNormalizado && u.password === password,
          );
          if (!usuario) return of(false);
          this.guardarSesion(usuario);
          return of(true);
        }),
      );
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
