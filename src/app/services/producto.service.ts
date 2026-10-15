import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion?: string;
  descuento?: number;
}

/**
 * Servicio que consume la API de productos desde JSON Server.
 * Estilo del profesor: una sola llamada GET directa con HttpClient.
 *
 * Si JSON Server no responde (ej. en Netlify sin backend), usa los
 * datos embebidos como fallback para que la UI nunca quede vacía.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/productos';

  // Datos embebidos como fallback. Son los mismos 12 productos de /db.json.
  private readonly productosFallback: Producto[] = [
    {
      id: 1,
      nombre: 'Cappuccino andino',
      imagen: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
      categoria: 'cafe',
      precio: 12,
      stock: 40,
      descripcion: 'Espresso de Quillabamba con leche espumada.',
    },
    {
      id: 2,
      nombre: 'Espresso doble',
      imagen: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80',
      categoria: 'cafe',
      precio: 9,
      stock: 35,
      descripcion: 'Grano orgánico tostado en batch pequeño.',
    },
    {
      id: 3,
      nombre: 'Cold brew de altura',
      imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
      categoria: 'cafe',
      precio: 14,
      stock: 14,
      descripcion: 'Extracción en frío por 18 horas.',
      descuento: 15,
    },
    {
      id: 4,
      nombre: 'Café filtrado V60',
      imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
      categoria: 'cafe',
      precio: 13,
      stock: 25,
      descripcion: 'Notas a cacao y frutos rojos.',
    },
    {
      id: 5,
      nombre: 'Tisana de muña',
      imagen: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&q=80',
      categoria: 'tisanas',
      precio: 8,
      stock: 30,
      descripcion: 'Hierba andina digestiva.',
    },
    {
      id: 6,
      nombre: 'Tisana de coca',
      imagen: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80',
      categoria: 'tisanas',
      precio: 8,
      stock: 22,
      descripcion: 'Infusión tradicional cusqueña.',
    },
    {
      id: 7,
      nombre: 'Hierba luisa',
      imagen: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&q=80',
      categoria: 'tisanas',
      precio: 7,
      stock: 3,
      descripcion: 'Infusión fresca y aromática.',
    },
    {
      id: 8,
      nombre: 'Tarta de lúcuma',
      imagen: 'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?w=400&q=80',
      categoria: 'postres',
      precio: 11,
      stock: 11,
      descripcion: 'Postre peruano con crema suave.',
      descuento: 20,
    },
    {
      id: 9,
      nombre: 'Alfajores de manjar blanco',
      imagen: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80',
      categoria: 'postres',
      precio: 10,
      stock: 28,
      descripcion: 'Caja de 3 unidades.',
    },
    {
      id: 10,
      nombre: 'Cheesecake de aguaymanto',
      imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80',
      categoria: 'postres',
      precio: 13,
      stock: 8,
      descripcion: 'Base crocante y coulis de aguaymanto.',
      descuento: 10,
    },
    {
      id: 11,
      nombre: 'Empanada de lomo saltado',
      imagen: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
      categoria: 'salados',
      precio: 6,
      stock: 18,
      descripcion: 'Relleno jugoso de lomo saltado.',
    },
    {
      id: 12,
      nombre: 'Sándwich de jamón del país',
      imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
      categoria: 'salados',
      precio: 9,
      stock: 12,
      descripcion: 'Pan ciabatta con jamón del país y ají.',
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los productos desde JSON Server.
   * Si la petición falla (red, CORS, server caído), usa los datos embebidos.
   * La UI nunca queda vacía.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError(() => of(this.productosFallback)),
    );
  }
}
