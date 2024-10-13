// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Express application',
    },
  },
  apis: ['./index.js', './routers/*.js'], // Archivos donde se documentarán las rutas
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};