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
  const newProduct = await pm.add({ title, description, code, price, status, stock, category, thumbnails: thumbnails || [] });
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.update(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  const deleted = await pm.delete(req.params.pid);
  if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado' });
});

module.exports = router; 