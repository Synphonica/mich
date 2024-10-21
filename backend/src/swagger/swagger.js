const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'API para gestionar productos y categorías',
    },
    servers: [
      {
        url: 'http://localhost:3000',  // Servidor de desarrollo
        description: 'Servidor local'
      }
    ],
  },
  apis: ['./src/controllers/*.js', './src/routers/*.js'],  // Apuntar a todos los controladores y routers
};

// Crear la especificación
const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
