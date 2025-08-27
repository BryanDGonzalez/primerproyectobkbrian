// Conectar con Socket.io
const socket = io();

// Elementos del DOM
const createProductForm = document.getElementById('createProductForm');
const productsList = document.getElementById('productsList');
const productCount = document.getElementById('productCount');
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.getElementById('toastMessage');

// Variables globales
let products = [];

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const toast = new bootstrap.Toast(notificationToast);
    toastMessage.textContent = message;
    
    // Cambiar el color del toast según el tipo
    const toastHeader = notificationToast.querySelector('.toast-header');
    const icon = toastHeader.querySelector('i');
    
    toastHeader.className = 'toast-header';
    icon.className = 'fas me-2';
    
    switch(type) {
        case 'success':
            toastHeader.classList.add('bg-success', 'text-white');
            icon.classList.add('fa-check-circle');
            break;
        case 'error':
            toastHeader.classList.add('bg-danger', 'text-white');
            icon.classList.add('fa-exclamation-circle');
            break;
        case 'warning':
            toastHeader.classList.add('bg-warning', 'text-dark');
            icon.classList.add('fa-exclamation-triangle');
            break;
        default:
            toastHeader.classList.add('bg-info', 'text-white');
            icon.classList.add('fa-info-circle');
    }
    
    toast.show();
}

// Función para actualizar el contador de productos
function updateProductCount() {
    const count = document.querySelectorAll('.product-item').length;
    if (productCount) {
        productCount.textContent = `${count} productos`;
    }
}

// Función para crear el HTML de un producto
function createProductHTML(product) {
    const stockClass = product.stock > 10 ? 'bg-success' : product.stock > 5 ? 'bg-warning' : 'bg-danger';
    const statusClass = product.status ? 'bg-success' : 'bg-secondary';
    const statusText = product.status ? 'Disponible' : 'No disponible';
    
    const thumbnailsHTML = product.thumbnails && product.thumbnails.length > 0 
        ? `<div class="mt-3">
             <small class="text-muted">Imágenes:</small>
             <div class="d-flex gap-1 mt-1">
               ${product.thumbnails.map(url => `<img src="${url}" alt="Thumbnail" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">`).join('')}
             </div>
           </div>`
        : '';

    return `
        <div class="col-md-6 mb-3 product-item" data-id="${product.id}">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title text-primary mb-0">${product.title}</h6>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}" title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <p class="card-text small text-muted">${product.description}</p>
                    <div class="row">
                        <div class="col-6">
                            <small class="text-muted">Código:</small>
                            <p class="mb-1 small"><strong>${product.code}</strong></p>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Categoría:</small>
                            <p class="mb-1 small"><strong>${product.category}</strong></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <small class="text-muted">Precio:</small>
                            <p class="mb-1 small"><strong class="text-success">$${product.price}</strong></p>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Stock:</small>
                            <p class="mb-1 small">
                                <span class="badge ${stockClass}">${product.stock}</span>
                            </p>
                        </div>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">Estado:</small>
                        <span class="badge ${statusClass}">${statusText}</span>
                    </div>
                    ${thumbnailsHTML}
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar la lista de productos
function renderProducts(productsArray) {
    if (!productsList) return;
    
    if (productsArray.length === 0) {
        productsList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay productos disponibles</h5>
                <p class="text-muted">Agrega productos usando el formulario</p>
            </div>
        `;
    } else {
        const productsHTML = `
            <div class="row">
                ${productsArray.map(product => createProductHTML(product)).join('')}
            </div>
        `;
        productsList.innerHTML = productsHTML;
    }
    
    updateProductCount();
    attachDeleteListeners();
}

// Función para agregar listeners a los botones de eliminar
function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-product');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = button.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                socket.emit('deleteProduct', productId);
            }
        });
    });
}

// Event listeners para Socket.io
socket.on('connect', () => {
    console.log('Conectado al servidor');
    showNotification('Conectado al servidor', 'success');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    showNotification('Desconectado del servidor', 'warning');
});

socket.on('productCreated', (newProduct) => {
    console.log('Producto creado:', newProduct);
    showNotification(`Producto "${newProduct.title}" creado exitosamente`, 'success');
    
    // Agregar el nuevo producto a la lista
    const productElement = document.createElement('div');
    productElement.innerHTML = createProductHTML(newProduct);
    const productDiv = productElement.firstElementChild;
    
    if (productsList.querySelector('.row')) {
        productsList.querySelector('.row').appendChild(productDiv);
    } else {
        productsList.innerHTML = `<div class="row">${createProductHTML(newProduct)}</div>`;
    }
    
    updateProductCount();
    attachDeleteListeners();
});

socket.on('productDeleted', (productId) => {
    console.log('Producto eliminado:', productId);
    showNotification('Producto eliminado exitosamente', 'success');
    
    // Eliminar el producto de la vista
    const productElement = document.querySelector(`[data-id="${productId}"]`);
    if (productElement) {
        productElement.remove();
        updateProductCount();
        
        // Si no quedan productos, mostrar mensaje
        if (document.querySelectorAll('.product-item').length === 0) {
            renderProducts([]);
        }
    }
});

socket.on('error', (error) => {
    console.error('Error:', error);
    showNotification(error.message || 'Ha ocurrido un error', 'error');
});

// Event listener para el formulario de crear producto
if (createProductForm) {
    createProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(createProductForm);
        const productData = {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            category: formData.get('category'),
            status: formData.get('status') === 'on',
            thumbnails: formData.get('thumbnails') 
                ? formData.get('thumbnails').split(',').map(url => url.trim()).filter(url => url)
                : []
        };
        
        // Validar campos requeridos
        if (!productData.title || !productData.description || !productData.code || 
            isNaN(productData.price) || isNaN(productData.stock) || !productData.category) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }
        
        // Enviar producto al servidor
        socket.emit('createProduct', productData);
        
        // Limpiar formulario
        createProductForm.reset();
        document.getElementById('status').checked = true;
    });
}

// Inicializar listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    attachDeleteListeners();
    updateProductCount();
    
    // Mostrar estado de conexión
    if (socket.connected) {
        showNotification('Conectado al servidor', 'success');
    }
});
