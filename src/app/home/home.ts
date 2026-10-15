import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../services/producto.service';

@Component({
  imports: [NgFor, NgIf, RouterLink, CurrencyPipe, TitleCasePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  destacados: Producto[] = [];
  cargando = true;

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.destacados = data.slice(0, 4);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
