# Café Andino
Aplicación web e-commerce para una cafetería artesanal de los Andes peruanos, desarrollada con Angular + Bootstrap + JSON Server. Cumple con todos los requisitos de la rúbrica PC2.

 ## Tecnologías usadas

- **Angular 22** (standalone components, sin signals, con `constructor(private ...)`)
- **Bootstrap 5.3** (grid responsive, cards, navbar, formularios, botones, tablas)
- **JSON Server 0.17** (API REST simulada)
- **TypeScript 6**
- **HTML5 + CSS3**

##  Funcionalidades implementadas (rúbrica)

### 1. Estructura general
-  Navbar reutilizable (`navbar/`)
-  Footer reutilizable (`footer/`)
-  Arquitectura basada en componentes (9 componentes standalone)

### 2. Páginas mínimas
| Página | Ruta | Componente |
|---|---|---|
| Home | `/` | `Home` |
| Productos | `/productos` | `Productos` |
| Ofertas | `/ofertas` | `Ofertas` |
| Tienda | `/tienda` | `Tienda` |
| Contacto | `/contacto` | `Contact` |
| Mi Cuenta | `/mi-cuenta` | `MiCuenta` |
| Login | `/login` | `Login` |
| Dashboard | `/dashboard` | `Dashboard` |
| 404 | `**` | `NotFound` |

### 3. Navegación y Routing
-  Angular Routing con `routerLink` y `routerLinkActive`
-  Navegación entre todas las páginas
-  Página 404 personalizada para rutas inexistentes
-  Redirección automática al Home si se intenta ingresar a `/dashboard` sin sesión (check manual en `Dashboard.ngOnInit`)

### 4. Simulación de Login
-  Formulario con `[(ngModel)]` para email y password
-  Validaciones básicas (campos obligatorios, mínimo 4 caracteres en password)
-  Persistencia en `localStorage` (clave `cafe_andino_sesion`)
-  Opción de cerrar sesión en navbar, dashboard y mi-cuenta

### 5. Uso obligatorio de Angular

**Data Binding:**
-  Interpolación `{{ }}` — ej. `{{ p.nombre }}`, `{{ p.precio | currency }}`
-  Property Binding `[ ]` — ej. `[src]="p.imagen"`, `[disabled]="p.stock === 0"`
-  Event Binding `( )` — ej. `(click)="agregar(p)"`, `(ngSubmit)="iniciarSesion()"`
-  Two-Way Data Binding `[(ngModel)]` — ej. login, contacto, buscador

**Directivas estructurales:**
- `*ngFor` — listado de productos, enlaces navbar, items carrito, etc.
-  `*ngIf` — condicionales en cards, carrito vacío, sesión, errores

**Directivas de atributos:**
-  `[ngClass]` — chips activas, badges por rol, alertas
-  `[ngStyle]` — color dinámico según stock en `productos.html`

**Pipes (6, supera el mínimo de 2):**
-  `CurrencyPipe` — precios en S/
-  `DatePipe` — fechas con formato `dd/MM/yyyy`
-  `UpperCasePipe` — títulos en home
-  `LowerCasePipe` — ejemplos en home
-  `TitleCasePipe` — categorías
-  `PercentPipe` — IGV referencial
-  `DecimalPipe` — formato numérico

### 6. Bootstrap
-  Grid responsive (`row`, `col-12 col-sm-6 col-lg-4`)
-  Cards (productos, dashboard, mi-cuenta, contacto)
-  Navbar con `navbar-expand-lg`
-  Formularios (`form-control`, `form-label`, `form-select`)
-  Botones (`btn btn-cafe`, `btn-outline-light`)
-  Tablas (`table table-striped`) en dashboard
-  Responsive para desktop y mobile

### 7. Base de datos simulada (db.json)
```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Cappuccino andino",
      "imagen": "https://...",
      "categoria": "cafe",
      "precio": 12,
      "stock": 40,
      "descripcion": "Espresso de Quillabamba con leche espumada."
    }
    // ... 12 productos
  ]
}
```
Cada producto cumple con los campos obligatorios: `nombre`, `imagen`, `categoria`, `precio`, `stock`.

### 8. Consumo de Servicios REST
-  JSON Server instalado (`json-server@0.17.4`)
-  Script `npm run api` levanta el servidor en `http://localhost:3000`
-  `ProductoService` consume la API con `HttpClient`
-  Productos se muestran dinámicamente en `/productos`

### 9. Página de Productos
-  Renderizado dinámico desde `db.json`
-  Muestra: imagen, nombre, categoría, precio, stock
-  Buscador por nombre (`[(ngModel)]="busqueda"`)
-  Filtro por categorías (chips con `[ngClass]`)
-  Ordenamiento por relevancia / precio / nombre
-  Cards responsive con grid Bootstrap

### 10. Dashboard
-  Bienvenida al usuario: `Bienvenido, {{ sesion.nombre }}`
-  Información del usuario logueado (nombre, correo, rol, fecha)
-  Estadísticas básicas (total productos, stock total, precio promedio, stock bajo)
-  Tabla de productos con stock bajo
-  Acceso restringido: si no hay sesión en `localStorage`, redirige a Home

### 11. Despliegue
-  Configurado para Netlify (`netlify.toml`)
-  SPA redirect habilitado
- Link del proyecto desplegado: _(agregar después del primer deploy)_

##  Instalación y ejecución

### Requisitos
- Node.js 20+ o 22+
- npm 11+

### Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. Levantar la API (JSON Server) en http://localhost:3000
npm run api

# 3. En otra terminal, levantar Angular en http://localhost:4200
npm start
```

O ejecutar ambos a la vez:
```bash
npm run dev
```

### Datos de prueba para login
- **Cliente:** `cliente@cafeandino.pe` / `1234`
- **Admin:** `admin@cafeandino.pe` / `1234`

> Cualquier email/contraseña (mínimo 4 caracteres) inicia sesión. Si el email empieza con `admin`, el rol es administrador; en caso contrario, cliente.

##  Despliegue en Netlify

1. Subir el repositorio a GitHub
2. Conectar el repo en https://app.netlify.com
3. Configuración automática (ya está en `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/cafe-andino/browser`
4. Deploy automático en cada push

##  Estructura del proyecto

```
cafeandino-pc2/
├── db.json                          # Productos (12 items)
├── netlify.toml                     # Config deploy
├── angular.json
├── package.json
├── public/
│   └── favicon.ico
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css                   # Design system + Bootstrap
    └── app/
        ├── app.ts                   # Root component
        ├── app.html
        ├── app.css
        ├── app.config.ts            # Providers (router, http)
        ├── app.routes.ts            # 9 rutas
        ├── navbar/                  # Navbar reutilizable
        ├── footer/                  # Footer reutilizable
        ├── home/                    # Landing + pipes de ejemplo
        ├── productos/               # Catálogo con buscador y filtros
        ├── ofertas/                 # Productos con descuento
        ├── tienda/                  # Catálogo + carrito simple
        ├── contact/                 # Formulario de contacto
        ├── mi-cuenta/               # Info de sesión
        ├── login/                   # Login con ngModel + localStorage
        ├── dashboard/               # Panel con estadísticas + bloqueo
        ├── not-found/               # 404 personalizada
        └── services/
            ├── auth.service.ts      # AuthService (login, logout, sesión)
            └── producto.service.ts  # ProductoService (HTTP GET)
```


