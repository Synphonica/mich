const express = require('express');
const cors = require('cors');  // Para permitir solicitudes desde otros dominios
const path = require('path');  // Para gestionar rutas de archivos
const { swaggerUi, specs } = require('./src/swagger/swagger');
const categoriasRouter = require('./src/routers/categorias.routers');
const productosRouter = require('./src/routers/productos.routers');
const usuariosRouter = require('./src/routers/usuarios.routers');

const app = express();
const port = 4000;

// Middleware para parsear JSON
app.use(express.json());

// Permitir CORS para cualquier origen
app.use(cors());

// Servir archivos estáticos de la carpeta "uploads" (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Swagger para la documentación de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Redirigir la raíz a la documentación de Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Registrar los routers
app.use('/api', categoriasRouter);
app.use('/api', productosRouter);
app.use('/api', usuariosRouter); 

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocurrió un error en el servidor', error: err.message });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
