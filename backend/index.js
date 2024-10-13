const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const categoriasRouter = require('./routers/categorias.routers');
const productosRouter = require('./routers/productos.routers');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    tags: [
      {
        name: 'Productos',
        description: 'Operaciones relacionadas con productos',
      },
      {
        name: 'Categorías',
        description: 'Operaciones relacionadas con categorías',
      },
    ],
  },
  apis: ['./index.js', './controllers/categorias.controller.js', './controllers/productos.controller.js'], // Archivos donde se documentarán las rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Redirigir la ruta raíz a la documentación de Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Registrar los routers
app.use('/api', categoriasRouter);
app.use('/api', productosRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});