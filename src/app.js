const express = require('express');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const pm = new ProductManager();

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials'),
  helpers: {
    // Helper para comparaciones
    gt: function(a, b) {
      return a > b;
    },
    eq: function(a, b) {
      return a === b;
    },
    // Helper para formatear precios
    formatPrice: function(price) {
      return `$${parseFloat(price).toFixed(2)}`;
    },
    // Helper para verificar si un array tiene elementos
    hasItems: function(array) {
      return array && array.length > 0;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Asegurar que los archivos de datos existan
const dataDir = path.join(__dirname, '../data');
const productsFile = path.join(dataDir, 'products.json');
const cartsFile = path.join(dataDir, 'carts.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, '[]');
if (!fs.existsSync(cartsFile)) fs.writeFileSync(cartsFile, '[]');

// Rutas API existentes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.get('/', async (req, res) => {
  try {
    const products = await pm.getAll();
    res.render('home', { products, title: 'Inicio' });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.render('home', { products: [], title: 'Inicio' });
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await pm.getAll();
    res.render('realTimeProducts', { products, title: 'Productos en Tiempo Real' });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.render('realTimeProducts', { products: [], title: 'Productos en Tiempo Real' });
  }
});



// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  // Evento para crear producto
  socket.on('createProduct', async (productData) => {
    try {
      const newProduct = await pm.add(productData);
      io.emit('productCreated', newProduct);
      console.log('Producto creado:', newProduct);
    } catch (error) {
      console.error('Error al crear producto:', error);
      socket.emit('error', { message: 'Error al crear el producto' });
    }
  });

  // Evento para eliminar producto
  socket.on('deleteProduct', async (productId) => {
    try {
      const deleted = await pm.delete(productId);
      if (deleted) {
        io.emit('productDeleted', productId);
        console.log('Producto eliminado:', productId);
      } else {
        socket.emit('error', { message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      socket.emit('error', { message: 'Error al eliminar el producto' });
    }
  });
});

// Hacer el servidor io disponible para las rutas
app.set('io', io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Vista home: http://localhost:${PORT}`);
  console.log(`Vista realtime: http://localhost:${PORT}/realtimeproducts`);
}); 