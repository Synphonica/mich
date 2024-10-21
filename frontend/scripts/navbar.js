// Función para cargar el navbar
document.addEventListener("DOMContentLoaded", function () {
    fetch("../pages/nav.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el navbar');
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data); // Insertar el navbar al principio del body
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
