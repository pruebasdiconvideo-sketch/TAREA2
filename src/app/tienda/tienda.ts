import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService, Producto } from '../services/producto.service';
import { PedidoService } from '../services/pedido.service';
import { AuthService, SesionUsuario } from '../services/auth.service';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  imports: [NgFor, NgIf, FormsModule, CurrencyPipe, TitleCasePipe],
  selector: 'app-tienda',
  styleUrl: './tienda.css',
  templateUrl: './tienda.html',
})
export class Tienda implements OnInit {
  productos: Producto[] = [];
  carrito: ItemCarrito[] = [];
  cargando = true;
  error = '';

  direccion = '';
  telefono = '';
  procesando = false;
  pedidoConfirmado = false;

  private sesion: SesionUsuario | null = null;

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sesion = this.auth.obtenerSesion();
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cargar la tienda.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  agregar(p: Producto): void {
    const item = this.carrito.find((i) => i.producto.id === p.id);
    if (item) {
      if (item.cantidad < p.stock) item.cantidad++;
    } else {
      this.carrito.push({ producto: p, cantidad: 1 });
    }
  }

  quitar(item: ItemCarrito): void {
    this.carrito = this.carrito.filter((i) => i !== item);
  }

  cambiarCantidad(item: ItemCarrito, delta: number): void {
    const nueva = item.cantidad + delta;
    if (nueva <= 0) {
      this.quitar(item);
      return;
    }
    if (nueva <= item.producto.stock) item.cantidad = nueva;
  }

  get total(): number {
    return this.carrito.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  }

  get cantidadTotal(): number {
    return this.carrito.reduce((acc, i) => acc + i.cantidad, 0);
  }

  get puedeConfirmar(): boolean {
    return this.carrito.length > 0 && this.direccion.trim().length > 0 && this.telefono.trim().length > 0;
  }

  vaciar(): void {
    this.carrito = [];
  }

  confirmarPedido(): void {
    if (!this.puedeConfirmar || this.procesando) return;

    this.sesion = this.auth.obtenerSesion();
    if (!this.sesion) {
      this.router.navigate(['/login']);
      return;
    }

    this.procesando = true;
    this.error = '';

    const pedido = {
      cliente: this.sesion.nombre,
      email: this.sesion.email,
      fecha: new Date().toISOString(),
      items: this.carrito.map((i) => ({
        nombre: i.producto.nombre,
        precio: i.producto.precio,
        cantidad: i.cantidad,
      })),
      total: this.total,
      estado: 'pendiente' as const,
      direccion: this.direccion,
      telefono: this.telefono,
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: () => {
        this.procesando = false;
        this.pedidoConfirmado = true;
        this.carrito = [];
        this.direccion = '';
        this.telefono = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.procesando = false;
        this.error = 'No se pudo registrar el pedido.';
        this.cdr.markForCheck();
      },
    });
  }

  cerrarConfirmacion(): void {
    this.pedidoConfirmado = false;
    this.router.navigate(['/mis-pedidos']);
  }
}
