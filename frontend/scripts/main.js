import { obtenerProductosPorCategoria } from './apiProductos.js';

// Función para mostrar productos filtrados por categoría
async function mostrarProductosCategoria(categoria_id) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    contenedorProductos.innerHTML = '';  // Limpiar el contenedor

    try {
        // Llamar a la API para obtener productos por categoría
        const productos = await obtenerProductosPorCategoria(categoria_id);
        console.log("Productos obtenidos:", productos);  // Depuración: Ver los productos obtenidos

        if (productos.length > 0) {
            productos.forEach(producto => {
                const card = crearTarjetaProducto(producto);
                contenedorProductos.appendChild(card);
            });
        } else {
            contenedorProductos.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        contenedorProductos.innerHTML = '<p>Error al cargar productos. Inténtalo de nuevo más tarde.</p>';
    }
}

// Función para crear la tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'product-card');

    const imagenUrl = `http://localhost:4000/uploads/${producto.imagen}`;  // URL de la imagen
    console.log("URL de la imagen:", imagenUrl);  // Depuración: Ver la URL de la imagen

    card.innerHTML = `
        <div class="card mb-4 shadow-sm">
            <img src="${imagenUrl}" alt="${producto.nombre}" class="card-img-top lazyload" style="max-height: 200px; object-fit: cover;">
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
    const categoria_id = document.body.dataset.categoriaId;  // Obtener el ID de la categoría
    console.log("ID de la categoría:", categoria_id);  // Depuración: Ver el ID de la categoría

    if (categoria_id) {
        mostrarProductosCategoria(categoria_id);  // Llamamos a la función con el ID de la categoría
    } else {
        console.error('No se encontró el ID de la categoría.');
    }
});
