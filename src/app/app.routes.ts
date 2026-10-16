import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Productos } from './productos/productos';
import { Ofertas } from './ofertas/ofertas';
import { Tienda } from './tienda/tienda';
import { Contact } from './contact/contact';
import { MiCuenta } from './mi-cuenta/mi-cuenta';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { Dashboard } from './dashboard/dashboard';
import { NotFound } from './not-found/not-found';
import { AdminPedidos } from './admin-pedidos/admin-pedidos';
import { MisPedidos } from './mis-pedidos/mis-pedidos';

export const routes: Routes = [
  { path: '', component: Home, title: 'Café Andino' },
  { path: 'productos', component: Productos, title: 'Productos' },
  { path: 'ofertas', component: Ofertas, title: 'Ofertas' },
  { path: 'tienda', component: Tienda, title: 'Tienda' },
  { path: 'contacto', component: Contact, title: 'Contacto' },
  { path: 'mi-cuenta', component: MiCuenta, title: 'Mi Cuenta' },
  { path: 'login', component: Login, title: 'Iniciar sesión' },
  { path: 'registro', component: Registro, title: 'Crear cuenta' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
  { path: 'mis-pedidos', component: MisPedidos, title: 'Mis pedidos' },
  { path: 'admin/pedidos', component: AdminPedidos, title: 'Gestión de pedidos' },
  { path: '**', component: NotFound, title: 'Página no encontrada' },
];
