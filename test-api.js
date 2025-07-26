const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testAPI() {
  console.log('🧪 Iniciando pruebas de la API...\n');

  try {
    // Test 1: Obtener todos los productos
    console.log('1️⃣ Probando GET /api/products');
    const products = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Productos obtenidos:', products.data.length, 'productos');
    console.log('📋 Productos:', products.data.map(p => ({ id: p.id, title: p.title })));
    console.log('');

    // Test 2: Obtener un producto específico
    console.log('2️⃣ Probando GET /api/products/1');
    const product = await axios.get(`${BASE_URL}/products/1`);
    console.log('✅ Producto obtenido:', product.data.title);
    console.log('');

    // Test 3: Crear un nuevo producto
    console.log('3️⃣ Probando POST /api/products');
    const newProduct = await axios.post(`${BASE_URL}/products`, {
      title: "Naruto Shippuden",
      description: "La historia de Naruto Uzumaki como ninja",
      code: "NAR001",
      price: 14.99,
      status: true,
      stock: 40,
      category: "Shonen",
      thumbnails: ["https://example.com/naruto1.jpg"]
    });
    console.log('✅ Producto creado:', newProduct.data.title, '(ID:', newProduct.data.id + ')');
    console.log('');

    // Test 4: Actualizar un producto
    console.log('4️⃣ Probando PUT /api/products/1');
    const updatedProduct = await axios.put(`${BASE_URL}/products/1`, {
      price: 16.99,
      stock: 45
    });
    console.log('✅ Producto actualizado:', updatedProduct.data.title, '- Precio:', updatedProduct.data.price);
    console.log('');

    // Test 5: Crear un carrito
    console.log('5️⃣ Probando POST /api/carts');
    const newCart = await axios.post(`${BASE_URL}/carts`);
    console.log('✅ Carrito creado con ID:', newCart.data.id);
    console.log('');

    // Test 6: Agregar producto al carrito
    console.log('6️⃣ Probando POST /api/carts/1/product/1');
    const cartWithProduct = await axios.post(`${BASE_URL}/carts/1/product/1`, {
      quantity: 2
    });
    console.log('✅ Producto agregado al carrito');
    console.log('🛒 Productos en carrito:', cartWithProduct.data.products);
    console.log('');

    // Test 7: Ver productos del carrito
    console.log('7️⃣ Probando GET /api/carts/1');
    const cartProducts = await axios.get(`${BASE_URL}/carts/1`);
    console.log('✅ Productos del carrito:', cartProducts.data);
    console.log('');

    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 