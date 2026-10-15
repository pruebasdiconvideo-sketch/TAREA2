import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoPedido = 'pendiente' | 'preparando' | 'entregado' | 'cancelado';

export interface ItemPedido {
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id?: number;
  cliente: string;
  email: string;
  fecha: string;
  items: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  direccion: string;
  telefono: string;
}

/**
 * Servicio para gestionar pedidos contra JSON Server.
 * Estilo del profesor: constructor con HttpClient, métodos directos.
 */
@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedidos';

  constructor(private http: HttpClient) {}

  /** Obtiene todos los pedidos (uso administrativo). */
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  /** Obtiene los pedidos de un cliente por su email. */
  getPedidosPorCliente(email: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`);
  }

  /** Crea un nuevo pedido. */
  crearPedido(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  /** Actualiza el estado de un pedido. */
  actualizarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}`, { estado });
  }
}
