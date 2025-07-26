# API RESTful para Tienda de Mangas

## Descripción
Backend en Node.js + Express para gestionar productos (mangas) y carritos de compra. Persistencia en archivos JSON.

## Estructura
```
primerproyecto-77525/
│
├── src/
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── app.js
│
├── data/
│   ├── products.json
│   └── carts.json
│
├── package.json
└── README.md
```

## Instalación

1. Instala dependencias:
   ```
npm install
   ```
2. Ejecuta el servidor:
   ```
npm start
   ```

## Endpoints

### Productos `/api/products`
- `GET /` - Listar todos los productos
- `GET /:pid` - Obtener producto por ID
- `POST /` - Crear producto
- `PUT /:pid` - Actualizar producto
- `DELETE /:pid` - Eliminar producto

### Carritos `/api/carts`
- `POST /` - Crear carrito
- `GET /:cid` - Ver productos del carrito
- `POST /:cid/product/:pid` - Agregar producto al carrito

## Notas
- Los datos se guardan en la carpeta `data/`.
- Probar con Postman u otro cliente HTTP.
- No incluye interfaz visual. 