import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, SesionUsuario } from '../services/auth.service';

@Component({
  imports: [NgClass, NgFor, NgIf, TitleCasePipe, RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {
  sesion: SesionUsuario | null = null;
  private suscripcion?: Subscription;

  enlaces = [
    { texto: 'Home', ruta: '/' },
    { texto: 'Productos', ruta: '/productos' },
    { texto: 'Ofertas', ruta: '/ofertas' },
    { texto: 'Tienda', ruta: '/tienda' },
    { texto: 'Contacto', ruta: '/contacto' },
    { texto: 'Mi Cuenta', ruta: '/mi-cuenta' },
  ];

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sesion = this.auth.obtenerSesion();
    this.suscripcion = this.auth.sesionCambio$.subscribe((nueva) => {
      this.sesion = nueva;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  esAdmin(): boolean {
    return this.sesion?.rol === 'administrador';
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
  }
}
