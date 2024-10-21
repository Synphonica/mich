const apiCategoriasURL = 'http://localhost:4000/api/categorias';

// Obtener todas las categorías desde la API
export async function obtenerCategorias() {
    const response = await fetch(apiCategoriasURL);
    if (!response.ok) {
        throw new Error('Error al obtener categorías');
    }
    const categorias = await response.json();
    return categorias;
}
