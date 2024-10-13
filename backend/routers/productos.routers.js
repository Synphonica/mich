const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productos.controller');

// Definir las rutas
router.get('/productos', getAllProducts);
router.get('/productos/:id', getProductById);
router.post('/productos', createProduct);
router.put('/productos/:id', updateProduct);
router.delete('/productos/:id', deleteProduct);

// Exportar el router
module.exports = router;