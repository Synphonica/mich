// Inicializar productos desde localStorage o establecer un array vacío si no hay productos almacenados
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Función para mostrar productos en el panel de administración
function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = ''; // Limpiar el contenido antes de añadir productos

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.categoria}</td>
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px;">
            </td>
            <td>
                <button class="btn btn-sm btn-primary editar-producto" data-id="${producto.id}">Editar</button>
                <button class="btn btn-sm btn-danger eliminar-producto" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        listaProductos.appendChild(fila);
    });

    // Añadir eventos para editar y eliminar productos
    document.querySelectorAll('.editar-producto').forEach(boton => {
        boton.addEventListener('click', editarProducto);
    });
    document.querySelectorAll('.eliminar-producto').forEach(boton => {
        boton.addEventListener('click', eliminarProducto);
    });
}

// Función para convertir la imagen en Base64
function convertirImagenABase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = (error) => reject(error);
        lector.readAsDataURL(archivo);
    });
}

// Función para guardar un nuevo producto o actualizar uno existente
async function guardarProducto(evento) {
    evento.preventDefault(); // Evitar el envío del formulario

    const idProducto = document.getElementById('id-producto').value;
    const nombre = document.getElementById('nombre-producto').value;
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const categoria = document.getElementById('categoria-producto').value;
    const archivoImagen = document.getElementById('imagen-producto').files[0];

    let imagenBase64 = '';

    if (archivoImagen) {
        // Convertir la imagen a Base64
        imagenBase64 = await convertirImagenABase64(archivoImagen);
    }

    if (idProducto) {
        // Actualizar producto existente
        const indice = productos.findIndex(p => p.id === parseInt(idProducto));
        productos[indice] = { 
            id: parseInt(idProducto), 
            nombre, 
            precio, 
            categoria, 
            imagen: imagenBase64 || productos[indice].imagen // Mantener la imagen anterior si no se sube una nueva
        };
    } else {
        // Crear un nuevo producto con un id único
        const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
        const nuevoProducto = { id: nuevoId, nombre, precio, categoria, imagen: imagenBase64 };
        productos.push(nuevoProducto);
    }

    // Guardar los productos actualizados en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));

    // Actualizar la lista de productos en la interfaz
    mostrarProductos();

    // Reiniciar el formulario
    document.getElementById('formulario-producto').reset();
}

// Función para editar un producto seleccionado
function editarProducto(evento) {
    const idProducto = evento.target.getAttribute('data-id');
    const producto = productos.find(p => p.id === parseInt(idProducto));

    // Llenar el formulario con los datos del producto a editar
    document.getElementById('id-producto').value = producto.id;
    document.getElementById('nombre-producto').value = producto.nombre;
    document.getElementById('precio-producto').value = producto.precio;
    document.getElementById('categoria-producto').value = producto.categoria;
    document.getElementById('imagen-producto-preview').src = producto.imagen || '';
}

// Función para eliminar un producto seleccionado
function eliminarProducto(evento) {
    const idProducto = evento.target.getAttribute('data-id');
    productos = productos.filter(p => p.id !== parseInt(idProducto));

    // Actualizar los productos en localStorage después de la eliminación
    localStorage.setItem('productos', JSON.stringify(productos));

    // Actualizar la lista de productos en la interfaz
    mostrarProductos();
}

// Agregar evento al formulario para guardar productos cuando se haga submit
document.getElementById('formulario-producto').addEventListener('submit', guardarProducto);

// Mostrar productos iniciales al cargar la página
document.addEventListener('DOMContentLoaded', mostrarProductos);
