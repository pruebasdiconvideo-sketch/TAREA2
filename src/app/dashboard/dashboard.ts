import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SesionUsuario } from '../services/auth.service';
import { PedidoService, Pedido } from '../services/pedido.service';

@Component({
  imports: [CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe, RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  sesion: SesionUsuario | null = null;
  pedidos: Pedido[] = [];
  cargando = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Redirección manual al Home si no hay sesión (rúbrica lo pide explícitamente)
    this.sesion = this.auth.obtenerSesion();
    if (!this.sesion) {
      this.router.navigate(['/']);
      return;
    }

    // Cargar pedidos según rol
    if (this.auth.esAdministrador()) {
      this.pedidoService.getPedidos().subscribe({
        next: (data) => {
          this.pedidos = data.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
          );
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cargando = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.pedidoService.getPedidosPorCliente(this.sesion.email).subscribe({
        next: (data) => {
          this.pedidos = data.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
          );
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

  esAdmin(): boolean {
    return this.sesion?.rol === 'administrador';
  }

  get totalPedidos(): number {
    return this.pedidos.length;
  }

  get pedidosPendientes(): number {
    return this.pedidos.filter((p) => p.estado === 'pendiente').length;
  }

  get pedidosEnPreparacion(): number {
    return this.pedidos.filter((p) => p.estado === 'preparando').length;
  }

  get ingresos(): number {
    return this.pedidos
      .filter((p) => p.estado === 'entregado')
      .reduce((acc, p) => acc + p.total, 0);
  }

  get totalCompras(): number {
    // Para clientes: total comprado (sin cancelados)
    return this.pedidos
      .filter((p) => p.estado !== 'cancelado')
      .reduce((acc, p) => acc + p.total, 0);
  }

  etiquetaEstado(estado: string): string {
    const etiquetas: Record<string, string> = {
      pendiente: 'Pendiente',
      preparando: 'En preparación',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return etiquetas[estado] ?? estado;
  }

  claseEstado(estado: string): string {
    const clases: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      preparando: 'bg-info text-dark',
      entregado: 'bg-success',
      cancelado: 'bg-secondary',
    };
    return clases[estado] ?? 'bg-secondary';
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
