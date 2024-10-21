import { obtenerCategorias } from './apiCategorias.js';  // Importamos la API de categorías
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from './apiProductos.js';  // Importamos la API de productos

// Cargar categorías en el <select> del formulario de productos
async function cargarCategorias() {
    try {
        const categorias = await obtenerCategorias();  // Llamamos a la API de categorías
        const selectCategoria = document.getElementById('categoria-producto');
        selectCategoria.innerHTML = '';  // Limpiamos el select antes de agregar las categorías

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error.message);
    }
}

// Mostrar todos los productos desde la API
async function mostrarProductos() {
    try {
        const productos = await obtenerProductos();
        const listaProductos = document.getElementById('lista-productos');
        listaProductos.innerHTML = '';  // Limpiar la tabla antes de agregar los productos

        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.categoria_nombre}</td>
                <td><img src="http://localhost:4000/uploads/${producto.imagen}" alt="${producto.nombre}" width="50"></td>
                <td>
                    <button class="btn btn-primary editar-producto" data-id="${producto.id}">Editar</button>
                    <button class="btn btn-danger eliminar-producto" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            listaProductos.appendChild(fila);

            // Añadir eventos de edición y eliminación
            fila.querySelector('.editar-producto').addEventListener('click', () => cargarProductoEnFormulario(producto));
            fila.querySelector('.eliminar-producto').addEventListener('click', () => eliminarProductoEvento(producto.id));
        });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
    }
}

// Cargar un producto en el formulario para editarlo
function cargarProductoEnFormulario(producto) {
    document.getElementById('id-producto').value = producto.id;
    document.getElementById('nombre-producto').value = producto.nombre;
    document.getElementById('descripcion-producto').value = producto.descripcion;
    document.getElementById('precio-producto').value = producto.precio;
    document.getElementById('categoria-producto').value = producto.categoria_id;
}

// Manejar la creación o edición de productos
document.getElementById('formulario-producto').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const idProducto = document.getElementById('id-producto').value;
    const nombre = document.getElementById('nombre-producto').value;
    const descripcion = document.getElementById('descripcion-producto').value;
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const categoria_id = document.getElementById('categoria-producto').value;
    const archivoImagen = document.getElementById('imagen-producto').files[0];

    // Verifica si todos los datos del producto están correctamente asignados
    if (!nombre || !descripcion || isNaN(precio) || !categoria_id || !archivoImagen) {
        alert('Todos los campos son obligatorios, incluyendo la imagen.');
        return;
    }

    const producto = {
        nombre,
        descripcion,
        precio,
        categoria_id
    };

    try {
        if (idProducto) {
            // Actualizar producto existente
            await actualizarProducto(idProducto, producto, archivoImagen);
            alert('Producto actualizado exitosamente');
        } else {
            // Crear nuevo producto
            await crearProducto(producto, archivoImagen);
            alert('Producto creado exitosamente');
        }

        mostrarProductos();  // Recargar la lista de productos
        document.getElementById('formulario-producto').reset();  // Limpiar el formulario
    } catch (error) {
        console.error('Error al guardar producto:', error.message);
        alert('Error al crear producto');
    }
});

// Eliminar un producto
async function eliminarProductoEvento(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            await eliminarProducto(id);
            alert('Producto eliminado exitosamente');
            mostrarProductos();  // Recargar la lista de productos
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    }
}

// Cargar productos y categorías cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    cargarCategorias();  // Cargar las categorías en el select del formulario
});
