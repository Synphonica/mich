const db = require("../db/db");
const jwt = require('jsonwebtoken'); // Si planeas usar JWT para la autenticación

/**
 * Crear un nuevo usuario
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El email ya está registrado
 *       500:
 *         description: Error del servidor
 */
const createUser = (req, res) => {
    const { nombre, email, contrasena } = req.body;

    // Verificar si el email ya existe en la base de datos
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Insertar el nuevo usuario
        db.query('INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)', [nombre, email, contrasena], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente', userId: results.insertId });
        });
    });
};

/**
 * Loguear un usuario
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Loguear un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Email o contraseña incorrectos
 *       500:
 *         description: Error del servidor
 */
const loginUser = (req, res) => {
    const { email, contrasena } = req.body;

    // Verificar si el email existe y si la contraseña coincide
    db.query('SELECT * FROM usuarios WHERE email = ? AND contrasena = ?', [email, contrasena], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        // Aquí puedes generar un token si planeas usar JWT
        const user = results[0];
        const token = jwt.sign({ id: user.id, email: user.email }, 'secreto_super_seguro', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    });
};

module.exports = {
    createUser,
    loginUser
};
