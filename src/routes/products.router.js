const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const pm = new ProductManager();

router.get('/', async (req, res) => {
  const products = await pm.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || price == null || status == null || stock == null || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  try {
    const newProduct = await pm.add({ title, description, code, price, status, stock, category, thumbnails: thumbnails || [] });
    
    // Emitir evento WebSocket si el servidor io está disponible
    const io = req.app.get('io');
    if (io) {
      io.emit('productCreated', newProduct);
    }
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.update(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await pm.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    
    // Emitir evento WebSocket si el servidor io está disponible
    const io = req.app.get('io');
    if (io) {
      io.emit('productDeleted', req.params.pid);
    }
    
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 