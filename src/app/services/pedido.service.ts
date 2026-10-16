import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

const CLAVE_PEDIDOS = 'cafe_andino_pedidos';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedidos';

  private readonly pedidosIniciales: Pedido[] = [
    {
      id: 1,
      cliente: 'Lucía Quispe',
      email: 'cliente@cafeandino.pe',
      fecha: '2026-10-10T14:30:00.000Z',
      items: [
        { nombre: 'Cappuccino andino', precio: 12, cantidad: 2 },
        { nombre: 'Tarta de lúcuma', precio: 11, cantidad: 1 },
      ],
      total: 35,
      estado: 'entregado',
      direccion: 'Av. El Sol 850, Cusco',
      telefono: '987654321',
    },
    {
      id: 2,
      cliente: 'Carlos Mamani',
      email: 'carlos@ejemplo.com',
      fecha: '2026-10-12T09:15:00.000Z',
      items: [
        { nombre: 'Espresso doble', precio: 9, cantidad: 3 },
        { nombre: 'Alfajores de manjar blanco', precio: 10, cantidad: 2 },
      ],
      total: 47,
      estado: 'preparando',
      direccion: 'Calle Tres 142, Cusco',
      telefono: '987111222',
    },
    {
      id: 3,
      cliente: 'Lucía Quispe',
      email: 'cliente@cafeandino.pe',
      fecha: '2026-10-14T17:45:00.000Z',
      items: [
        { nombre: 'Cold brew de altura', precio: 14, cantidad: 1 },
        { nombre: 'Cheesecake de aguaymanto', precio: 13, cantidad: 1 },
      ],
      total: 27,
      estado: 'pendiente',
      direccion: 'Av. El Sol 850, Cusco',
      telefono: '987654321',
    },
    {
      id: 4,
      cliente: 'María Rojas',
      email: 'maria@ejemplo.com',
      fecha: '2026-10-15T08:00:00.000Z',
      items: [
        { nombre: 'Tisana de muña', precio: 8, cantidad: 2 },
        { nombre: 'Empanada de lomo saltado', precio: 6, cantidad: 4 },
      ],
      total: 40,
      estado: 'pendiente',
      direccion: 'Urb. Los Andes 12, Cusco',
      telefono: '955333444',
    },
    {
      id: 5,
      cliente: 'Carlos Mamani',
      email: 'carlos@ejemplo.com',
      fecha: '2026-10-08T13:20:00.000Z',
      items: [
        { nombre: 'Café filtrado V60', precio: 13, cantidad: 1 },
        { nombre: 'Sándwich de jamón del país', precio: 9, cantidad: 1 },
      ],
      total: 22,
      estado: 'cancelado',
      direccion: 'Calle Tres 142, Cusco',
      telefono: '987111222',
    },
  ];

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      catchError(() => of(this.leerPedidosLocales())),
    );
  }

  getPedidosPorCliente(email: string): Observable<Pedido[]> {
    return this.http
      .get<Pedido[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`)
      .pipe(catchError(() => of(this.leerPedidosLocales().filter((p) => p.email === email))));
  }

  crearPedido(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido).pipe(
      catchError(() => {
        const nuevo: Pedido = { ...pedido, id: this.siguienteIdLocal() };
        this.guardarPedidoLocal(nuevo);
        return of(nuevo);
      }),
    );
  }

  actualizarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}`, { estado }).pipe(
      catchError(() => {
        this.actualizarPedidoLocal(id, estado);
        const pedido = this.leerPedidosLocales().find((p) => p.id === id);
        return of(pedido as Pedido);
      }),
    );
  }

  private leerPedidosLocales(): Pedido[] {
    try {
      const guardados = localStorage.getItem(CLAVE_PEDIDOS);
      if (guardados) return JSON.parse(guardados) as Pedido[];
    } catch {}
    this.guardarPedidosLocales(this.pedidosIniciales);
    return this.pedidosIniciales;
  }

  private guardarPedidosLocales(pedidos: Pedido[]): void {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
  }

  private guardarPedidoLocal(pedido: Pedido): void {
    const pedidos = this.leerPedidosLocales();
    pedidos.push(pedido);
    this.guardarPedidosLocales(pedidos);
  }

  private actualizarPedidoLocal(id: number, estado: EstadoPedido): void {
    const pedidos = this.leerPedidosLocales();
    const pedido = pedidos.find((p) => p.id === id);
    if (pedido) {
      pedido.estado = estado;
      this.guardarPedidosLocales(pedidos);
    }
  }

  private siguienteIdLocal(): number {
    const pedidos = this.leerPedidosLocales();
    return pedidos.reduce((max, p) => Math.max(max, p.id ?? 0), 0) + 1;
  }
}
