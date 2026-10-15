import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  imports: [FormsModule, NgIf],
  selector: 'app-contact',
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  nombre = '';
  email = '';
  mensaje = '';
  enviado = false;

  enviar(): void {
    if (this.nombre && this.email && this.mensaje) {
      this.enviado = true;
      // Limpiar formulario
      this.nombre = '';
      this.email = '';
      this.mensaje = '';
    }
  }
}
