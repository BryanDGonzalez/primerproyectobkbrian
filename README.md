# Tienda de Mangas - API RESTful con WebSockets

Aplicación web para gestionar una tienda de mangas con funcionalidades en tiempo real usando Express.js, Handlebars y Socket.io.

## 🚀 Características

- **API RESTful** completa para productos y carritos
- **Vistas dinámicas** con Handlebars como motor de plantillas
- **Actualización en tiempo real** usando WebSockets (Socket.io)
- **Interfaz moderna** con Bootstrap 5 y Font Awesome
- **Gestión de productos** con formularios interactivos
- **Notificaciones en tiempo real** para acciones de usuario

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd proyecto
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:8080`

## 📁 Estructura del Proyecto

```
proyecto/
├── data/
│   ├── products.json      # Datos de productos
│   └── carts.json         # Datos de carritos
├── public/
│   ├── css/
│   │   └── styles.css     # Estilos personalizados
│   └── js/
│       └── main.js        # JavaScript del cliente
├── src/
│   ├── app.js             # Servidor principal
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   └── routes/
│       ├── products.router.js
│       └── carts.router.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── home.handlebars
│   └── realTimeProducts.handlebars
└── package.json
```

## 🌐 Vistas

### 1. Vista Home (`/`)
- Muestra todos los productos de forma estática
- Diseño responsive con tarjetas de productos
- Navegación a la vista de tiempo real

### 2. Vista Productos en Tiempo Real (`/realtimeproducts`)
- **Formulario de creación** de productos
- **Lista dinámica** que se actualiza automáticamente
- **Botones de eliminación** para cada producto
- **Notificaciones en tiempo real** para todas las acciones

## 🔌 API REST

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Carritos
- `GET /api/carts` - Obtener todos los carritos
- `GET /api/carts/:id` - Obtener carrito por ID
- `POST /api/carts` - Crear nuevo carrito
- `POST /api/carts/:id/products` - Agregar producto al carrito
- `DELETE /api/carts/:id/products/:pid` - Eliminar producto del carrito

## ⚡ WebSockets

La aplicación utiliza Socket.io para la comunicación en tiempo real:

### Eventos del Cliente al Servidor
- `createProduct` - Crear un nuevo producto
- `deleteProduct` - Eliminar un producto

### Eventos del Servidor al Cliente
- `productCreated` - Producto creado exitosamente
- `productDeleted` - Producto eliminado exitosamente
- `error` - Error en la operación

## 🎨 Tecnologías

- **Backend**: Node.js, Express.js
- **Motor de Plantillas**: Handlebars
- **WebSockets**: Socket.io
- **Frontend**: Bootstrap 5, Font Awesome
- **Almacenamiento**: JSON (archivos locales)

## 🚀 Funcionalidades

### Gestión de Productos en Tiempo Real
- Crear productos usando formularios interactivos
- Eliminar productos con confirmación
- Actualización automática de la lista
- Validación de campos en tiempo real

### Interfaz de Usuario
- Diseño responsive y moderno
- Notificaciones toast para feedback
- Iconos intuitivos con Font Awesome
- Animaciones suaves y transiciones

### Integración API + WebSockets
- Las operaciones HTTP también emiten eventos WebSocket
- Sincronización automática entre todas las vistas
- Manejo de errores robusto

## 📱 Uso

1. Accede a la aplicación: `http://localhost:8080`
2. Vista Home: Explora los productos existentes
3. Vista Tiempo Real: 
   - Usa el formulario para crear productos
   - Haz clic en el botón de eliminar para quitar productos
   - Observa las actualizaciones en tiempo real

## 🔧 Configuración

### Variables de Entorno
- `PORT`: Puerto del servidor (por defecto: 8080)

## 📝 Notas

- Los datos se almacenan en archivos JSON en la carpeta `data/`
- Las plantillas Handlebars incluyen helpers personalizados
- El sistema maneja errores de forma robusta
- La aplicación es completamente responsive

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. 