import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService, Pedido } from '../services/pedido.service';
import { AuthService, SesionUsuario } from '../services/auth.service';

@Component({
  imports: [CurrencyPipe, DatePipe, NgClass, NgFor, NgIf],
  selector: 'app-mis-pedidos',
  styleUrl: './mis-pedidos.css',
  templateUrl: './mis-pedidos.html',
})
export class MisPedidos implements OnInit {
  sesion: SesionUsuario | null = null;
  pedidos: Pedido[] = [];
  cargando = true;
  error = '';

  constructor(
    private auth: AuthService,
    private pedidoService: PedidoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sesion = this.auth.obtenerSesion();
    if (!this.sesion) {
      this.router.navigate(['/login']);
      return;
    }
    this.pedidoService.getPedidosPorCliente(this.sesion.email).subscribe({
      next: (data) => {
        this.pedidos = data.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar tus pedidos.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
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
}
