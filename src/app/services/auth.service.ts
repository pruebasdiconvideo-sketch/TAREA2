import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
 * Servicio de autenticación con localStorage y validación contra JSON Server.
 * Estilo del profesor: constructor con HttpClient, métodos directos, sin signals.
 *
 * Emite un evento (sesionCambio$) cada vez que la sesión cambia (login/logout),
 * para que el navbar y otros componentes puedan reaccionar sin recargar la página.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private sesion: SesionUsuario | null = null;
  private sesionCambioSubject = new Subject<SesionUsuario | null>();
  readonly sesionCambio$ = this.sesionCambioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.sesion = this.leerSesion();
  }

  /**
   * Valida credenciales contra /usuarios del JSON Server.
   * Si coinciden, guarda la sesión en localStorage y emite el cambio.
   */
  iniciarSesion(email: string, password: string): Observable<boolean> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${encodeURIComponent(email.toLowerCase())}`).pipe(
      map((usuarios) => {
        const usuario = usuarios.find((u) => u.password === password);
        if (!usuario) return false;
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
        return true;
      }),
    );
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
