let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Función para mostrar productos filtrados por categoría
function mostrarProductosCategoria(categoria) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor

    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);

    if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(producto => {
            const card = crearTarjetaProducto(producto);
            contenedorProductos.appendChild(card);
        });
    } else {
        contenedorProductos.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
    }
}

// Función para crear la tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'product-card');
    card.innerHTML = `
        <div class="card mb-4 shadow-sm">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top lazyload" style="max-height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                <button class="btn btn-primary ver-producto" data-id="${producto.id}">Ver producto</button>
            </div>
        </div>`;
    return card;
}

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const bodyId = document.body.id;
    if (bodyId) {
        mostrarProductosCategoria(bodyId);
    }
});
