const apiProductosURL = 'http://localhost:4000/api/productos';

// Obtener todos los productos
export async function obtenerProductos() {
    const response = await fetch(apiProductosURL);
    if (!response.ok) {
        throw new Error('Error al obtener productos');
    }
    const productos = await response.json();
    return productos;
}

// Obtener productos filtrados por categoría
export async function obtenerProductosPorCategoria(categoria_id) {
    const response = await fetch(`${apiProductosURL}/categoria/${categoria_id}`);
    if (!response.ok) {
        throw new Error('Error al obtener productos de la categoría');
    }
    const productos = await response.json();
    return productos;
}

// Crear un nuevo producto
export async function crearProducto(producto, imagen) {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('categoria_id', producto.categoria_id);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(apiProductosURL, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al crear producto');
    }

    return await response.json();
}

// Actualizar un producto existente
export async function actualizarProducto(id, producto, imagen) {
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('categoria_id', producto.categoria_id);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    const response = await fetch(`${apiProductosURL}/${id}`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al actualizar producto');
    }

    return await response.json();
}

// Eliminar un producto
export async function eliminarProducto(id) {
    const response = await fetch(`${apiProductosURL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Error al eliminar producto');
    }
}
