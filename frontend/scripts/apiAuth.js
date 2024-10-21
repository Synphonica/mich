// Función para manejar el login
export async function login(email, password) {
    try {
        const response = await fetch('http://localhost:4000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena: password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login exitoso');
            localStorage.setItem('token', data.token);  // Guardar el token
            window.location.href = 'index.html';  // Redirigir a la página principal
        } else {
            console.error("Error en el login", data);  // Depuración
            alert(data.message || 'Error en el login');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
    }
}

// Función para manejar el registro
export async function register(name, email, password) {
    try {
        const response = await fetch('http://localhost:4000/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: name, email, contrasena: password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = 'login.html';  // Redirigir a la página de login
        } else {
            console.error("Error en el registro", data);  // Depuración
            alert(data.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
    }
}
