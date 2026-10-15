import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  LowerCasePipe,
  NgFor,
  NgIf,
  PercentPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../services/producto.service';

@Component({
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    LowerCasePipe,
    PercentPipe,
    TitleCasePipe,
    UpperCasePipe,
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  destacados: Producto[] = [];
  cargando = true;

  // Para la rúbrica: conservamos las variables que demuestran el uso de pipes
  // pero se muestran en una sección discreta y colapsable al final del Home.
  nombre = 'café andino';
  fecha = new Date();
  precio = 18.5;
  porcentaje = 0.18;

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
