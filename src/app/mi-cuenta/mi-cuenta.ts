import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, SesionUsuario } from '../services/auth.service';

@Component({
  imports: [DatePipe, NgIf, TitleCasePipe, RouterLink],
  selector: 'app-mi-cuenta',
  styleUrl: './mi-cuenta.css',
  templateUrl: './mi-cuenta.html',
})
export class MiCuenta implements OnInit, OnDestroy {
  sesion: SesionUsuario | null = null;
  private suscripcion?: Subscription;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

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

  irAlDashboard(): void {
    if (this.sesion) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
