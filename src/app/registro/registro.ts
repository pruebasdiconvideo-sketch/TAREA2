import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  imports: [FormsModule, NgIf, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  nombre = '';
  email = '';
  password = '';
  confirmar = '';
  error = '';
  cargando = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  get clavesDistintas(): boolean {
    return this.confirmar !== '' && this.password !== this.confirmar;
  }

  /**
   * Registra un nuevo cliente. Si el email ya existe, muestra error.
   * Si todo está bien, crea la cuenta, inicia sesión y redirige al dashboard.
   */
  registrar(form: NgForm): void {
    this.error = '';
    if (form.invalid) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }
    if (this.password.length < 4) {
      this.error = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }
    if (this.clavesDistintas) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.auth.registrarCliente(this.nombre, this.email, this.password).subscribe({
      next: (ok) => {
        this.cargando = false;
        if (ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Ya existe una cuenta con ese correo electrónico.';
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo crear la cuenta. Intenta de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }
}
