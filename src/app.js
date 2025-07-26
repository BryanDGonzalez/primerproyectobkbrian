const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Asegurar que los archivos de datos existan
const dataDir = path.join(__dirname, '../data');
const productsFile = path.join(dataDir, 'products.json');
const cartsFile = path.join(dataDir, 'carts.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, '[]');
if (!fs.existsSync(cartsFile)) fs.writeFileSync(cartsFile, '[]');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
  console.log('Servidor escuchando en puerto 8080');
}); 