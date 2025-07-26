const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

class ProductManager {
  async getAll() {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find(p => p.id === id);
  }

  async add(product) {
    const products = await this.getAll();
    const newProduct = {
      id: products.length > 0 ? String(Number(products[products.length - 1].id) + 1) : '1',
      ...product
    };
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async update(id, updateData) {
    const products = await this.getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updateData, id };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return products[idx];
  }

  async delete(id) {
    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filtered, null, 2));
    return true;
  }
}

module.exports = ProductManager; 