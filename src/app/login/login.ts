import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  imports: [FormsModule, NgIf],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  iniciarSesion(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    if (this.password.length < 4) {
      this.error = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.cargando = true;
    this.auth.iniciarSesion(this.email, this.password).subscribe({
      next: (ok) => {
        this.cargando = false;
        if (ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Correo o contraseña incorrectos.';
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo conectar con el servidor. ¿Está corriendo JSON Server (npm run api)?';
        this.cdr.markForCheck();
      },
    });
  }
}
