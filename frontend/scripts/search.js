document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el envío del formulario

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();  // Obtener el término de búsqueda
    const productos = JSON.parse(localStorage.getItem('productos')) || [];  // Obtener productos del localStorage

    // Filtrar productos que coincidan con el término de búsqueda
    const productosFiltrados = productos.filter(function(producto) {
        return producto.nombre.toLowerCase().includes(searchTerm);
    });

    if (productosFiltrados.length === 1) {
        // Si solo se encuentra un producto, redirigir a la página de la categoría correspondiente
        const productId = productosFiltrados[0].id;
        const categoria = productosFiltrados[0].categoria;
        window.location.href = `/pages/${categoria}.html#product-${productId}`;
    } else if (productosFiltrados.length > 1) {
        // Si se encuentran varios productos, redirigir a una página de resultados o mostrar mensaje
        alert("Se encontraron múltiples productos. Por favor, especifica más tu búsqueda.");
        // Aquí puedes implementar una página de resultados si lo necesitas
    } else {
        // Si no se encuentra ningún producto, mostrar un mensaje
        alert("No se encontraron productos que coincidan con tu búsqueda.");
    }
});