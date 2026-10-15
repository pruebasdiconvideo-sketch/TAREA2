import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService, Pedido, EstadoPedido } from '../services/pedido.service';
import { AuthService } from '../services/auth.service';

type FiltroEstado = EstadoPedido | 'todos';

@Component({
  imports: [CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, FormsModule],
  selector: 'app-admin-pedidos',
  styleUrl: './admin-pedidos.css',
  templateUrl: './admin-pedidos.html',
})
export class AdminPedidos implements OnInit {
  pedidos: Pedido[] = [];
  cargando = true;
  error = '';
  accesoDenegado = false;

  filtroEstado: FiltroEstado = 'todos';
  busqueda = '';
  pedidoExpandido: number | null = null;

  readonly estados: { valor: EstadoPedido; etiqueta: string; clase: string }[] = [
    { valor: 'pendiente', etiqueta: 'Pendiente', clase: 'bg-warning text-dark' },
    { valor: 'preparando', etiqueta: 'En preparación', clase: 'bg-info text-dark' },
    { valor: 'entregado', etiqueta: 'Entregado', clase: 'bg-success' },
    { valor: 'cancelado', etiqueta: 'Cancelado', clase: 'bg-secondary' },
  ];

  constructor(
    private pedidoService: PedidoService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Verificación de rol: si no es administrador, redirigir al home
    if (!this.auth.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.auth.esAdministrador()) {
      this.accesoDenegado = true;
      this.cargando = false;
      this.cdr.markForCheck();
      // Redirigir tras 2 segundos
      setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        // Ordenar por fecha descendente (más reciente primero)
        this.pedidos = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar los pedidos. ¿Está corriendo JSON Server?';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  get pedidosFiltrados(): Pedido[] {
    const texto = this.busqueda.trim().toLowerCase();
    return this.pedidos.filter((p) => {
      const coincideEstado = this.filtroEstado === 'todos' || p.estado === this.filtroEstado;
      const coincideTexto =
        !texto ||
        p.cliente.toLowerCase().includes(texto) ||
        p.email.toLowerCase().includes(texto) ||
        String(p.id).includes(texto);
      return coincideEstado && coincideTexto;
    });
  }

  get totalesPorEstado(): Record<EstadoPedido, number> {
    return {
      pendiente: this.pedidos.filter((p) => p.estado === 'pendiente').length,
      preparando: this.pedidos.filter((p) => p.estado === 'preparando').length,
      entregado: this.pedidos.filter((p) => p.estado === 'entregado').length,
      cancelado: this.pedidos.filter((p) => p.estado === 'cancelado').length,
    };
  }

  get ingresosTotales(): number {
    return this.pedidos
      .filter((p) => p.estado === 'entregado')
      .reduce((acc, p) => acc + p.total, 0);
  }

  cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido): void {
    if (!pedido.id || pedido.estado === nuevoEstado) return;
    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = `No se pudo actualizar el pedido #${pedido.id}.`;
        this.cdr.markForCheck();
      },
    });
  }

  toggleExpandir(id: number | undefined): void {
    if (id === undefined) return;
    this.pedidoExpandido = this.pedidoExpandido === id ? null : id;
  }

  etiquetaEstado(estado: EstadoPedido): string {
    return this.estados.find((e) => e.valor === estado)?.etiqueta ?? estado;
  }

  claseEstado(estado: EstadoPedido): string {
    return this.estados.find((e) => e.valor === estado)?.clase ?? 'bg-secondary';
  }
}
