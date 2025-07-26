const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const cm = new CartManager();

router.post('/', async (req, res) => {
  const newCart = await cm.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { quantity } = req.body;
  const updatedCart = await cm.addProductToCart(req.params.cid, req.params.pid, quantity || 1);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updatedCart);
});

module.exports = router; 