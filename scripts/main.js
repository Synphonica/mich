let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Función para mostrar productos filtrados por categoría
function mostrarProductosCategoria(categoria) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    
    // Limpiar el contenedor antes de añadir nuevos productos
    contenedorProductos.innerHTML = '';

    // Filtrar los productos por la categoría pasada como argumento
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);

    if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'product-card');
            card.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top" style="max-height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                    </div>
                </div>
            `;
            contenedorProductos.appendChild(card);
        });

        // Añadir eventos a los botones "Ver producto"
        document.querySelectorAll('.ver-producto').forEach(boton => {
            boton.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                window.location.href = `detalles_producto.html?id=${productId}`;
            });
        });
    } else {
        contenedorProductos.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
    }
}

// Mostrar productos en la categoría adecuada cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    const bodyId = document.body.id;
    
    // Si el body tiene un id (como "accesorios", "peluches", etc.), llamamos a la función con ese id
    if (bodyId) {
        mostrarProductosCategoria(bodyId);
    }
});