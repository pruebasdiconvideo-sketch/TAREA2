import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgClass, NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../services/producto.service';

type Orden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre';

@Component({
  imports: [NgClass, NgFor, NgIf, NgStyle, FormsModule, CurrencyPipe, TitleCasePipe],
  selector: 'app-productos',
  styleUrl: './productos.css',
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  busqueda = '';
  categoria = '';
  orden: Orden = 'relevancia';
  cargando = true;
  error = '';

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cargar el catálogo. ¿Está corriendo JSON Server (npm run api)?';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  get categorias(): string[] {
    return [...new Set(this.productos.map((p) => p.categoria))];
  }

  get filtrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();
    const lista = this.productos.filter(
      (p) =>
        (!this.categoria || p.categoria === this.categoria) &&
        p.nombre.toLowerCase().includes(texto),
    );
    switch (this.orden) {
      case 'precio-asc':
        return [...lista].sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return [...lista].sort((a, b) => b.precio - a.precio);
      case 'nombre':
        return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
      default:
        return lista;
    }
  }

  seleccionarCategoria(cat: string): void {
    this.categoria = cat;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoria = '';
    this.orden = 'relevancia';
  }
}
