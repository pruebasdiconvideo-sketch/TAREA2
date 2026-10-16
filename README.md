# Café Andino — PC2 JavaScript Avanzado

Proyecto de una cafetería online hecha con Angular. Permite ver productos, armar pedidos y gestionarlos con diferentes estados. Es el trabajo de la PC2 del curso.

## Tecnologías usadas

- Angular 22 (standalone components)
- Bootstrap 5 + Bootstrap Icons
- JSON Server (base de datos simulada)
- TypeScript
- Google Fonts (Playfair Display + Inter)

## Cómo ejecutar el proyecto

Necesitas tener Node.js 20+ instalado.

```bash
npm install
```

Después abres **dos terminales**:

**Terminal 1 — Base de datos:**
```bash
npx json-server --watch db.json --port 3000
```

**Terminal 2 — Aplicación Angular:**
```bash
npx ng serve
```

Abres `http://localhost:4200` en el navegador y listo.

## Usuarios para probar

| Tipo | Email | Contraseña |
|---|---|---|
| Administrador | admin@cafeandino.pe | 1234 |
| Cliente | cliente@cafeandino.pe | 1234 |

También puedes crear una cuenta nueva desde la página de registro.

## Páginas del proyecto

- **Home** — landing con productos destacados
- **Productos** — catálogo con buscador y filtro por categorías
- **Ofertas** — productos con descuento
- **Tienda** — catálogo con carrito de compras
- **Contacto** — formulario de contacto
- **Mi Cuenta** — información del usuario logueado
- **Login** — iniciar sesión
- **Registro** — crear cuenta nueva
- **Dashboard** — panel con estadísticas (redirige al home si no hay sesión)
- **Mis pedidos** — historial de pedidos del cliente
- **Gestión de pedidos** — solo para admin, cambiar estados de los pedidos
- **404** — página no encontrada

## Funcionalidades principales

- Login con localStorage y validación
- Registro de nuevos clientes
- Catálogo de 12 productos (cafés, tisanas, postres y salados)
- Carrito de compras con checkout
- Creación de pedidos
- Gestión de pedidos con 4 estados: Pendiente, En preparación, Entregado, Cancelado
- Solo el administrador puede ver y cambiar estados de pedidos
- Dashboard diferente según el rol (admin ve todo, cliente ve solo lo suyo)
- Página 404 personalizada
- Diseño responsive

## Cosas que cumple de la rúbrica

- Data binding: interpolación, property binding, event binding, two-way binding con `[(ngModel)]`
- Directivas: `*ngFor`, `*ngIf`, `[ngClass]`, `[ngStyle]`
- Pipes: `CurrencyPipe`, `DatePipe`, `TitleCasePipe`
- Bootstrap: grid, cards, navbar, formularios, botones, tablas
- JSON Server como base de datos para los pedidos
- Navbar y footer reutilizables
- Routing con página 404
- Redirección al home si se intenta entrar al dashboard sin sesión
- Despliegue configurado para Netlify

## Despliegue en Netlify

1. Subir el repo a GitHub
2. Conectar el repo en https://app.netlify.com
3. Configuración (ya está en `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist/cafe-andino/browser`
4. Deploy automático en cada push

## Estructura del proyecto

```
src/app/
├── home/              # landing
├── productos/         # catálogo con filtros
├── ofertas/           # productos con descuento
├── tienda/            # carrito + checkout
├── contact/           # formulario de contacto
├── login/             # iniciar sesión
├── registro/          # crear cuenta
├── dashboard/         # panel con estadísticas
├── mi-cuenta/         # info del usuario
├── mis-pedidos/       # historial del cliente
├── admin-pedidos/     # gestión de pedidos (solo admin)
├── navbar/            # barra de navegación
├── footer/            # pie de página
├── not-found/         # página 404
└── services/
    ├── auth.service.ts       # login, registro, sesión
    ├── producto.service.ts   # catálogo de productos
    └── pedido.service.ts     # gestión de pedidos (usa JSON Server)
```

## Notas

- El login y los productos usan datos predefinidos en el código para que funcionen siempre.
- Los pedidos sí usan JSON Server para que se guarden los cambios de estado.
- Si JSON Server no está corriendo, la app igual funciona (usa localStorage como respaldo).
