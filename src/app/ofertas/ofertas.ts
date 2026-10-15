import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ProductoService, Producto } from '../services/producto.service';

@Component({
  imports: [NgFor, NgIf, CurrencyPipe],
  selector: 'app-ofertas',
  styleUrl: './ofertas.css',
  templateUrl: './ofertas.html',
})
export class Ofertas implements OnInit {
  ofertas: Producto[] = [];
  cargando = true;
  error = '';

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.ofertas = data.filter((p) => !!p.descuento && p.descuento > 0);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cargar las ofertas.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  precioFinal(p: Producto): number {
    return p.descuento ? +(p.precio * (1 - p.descuento / 100)).toFixed(2) : p.precio;
  }
}
