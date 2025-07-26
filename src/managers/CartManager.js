const fs = require('fs').promises;
const path = require('path');

const CARTS_FILE = path.join(__dirname, '../../data/carts.json');

class CartManager {
  async getAll() {
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getAll();
    const newCart = {
      id: carts.length > 0 ? String(Number(carts[carts.length - 1].id) + 1) : '1',
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getAll();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const carts = await this.getAll();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;
    const prod = cart.products.find(p => p.product === productId);
    if (prod) {
      prod.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager; 