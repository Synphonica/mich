const express = require('express');
const { createUser, loginUser } = require('../controllers/usuarios.controller');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/usuarios', createUser);

// Ruta para loguear un usuario
router.post('/usuarios/login', loginUser);

module.exports = router;
