const db = require("../db/db");
const multer = require('multer');

// Configuración de Multer para subir imágenes a la carpeta 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Inicializar Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limitar a 5MB
});

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * /api/productos/categoria/{categoria_id}:
 *   get:
 *     summary: Obtener productos por categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: categoria_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: number
 *                     format: float
 *                   imagen:
 *                     type: string
 *                   categoria_nombre:
 *                     type: string
 *       500:
 *         description: Error al obtener productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
const getProductsByCategory = (req, res) => {
    const { categoria_id } = req.params; // Obtener el ID de la categoría desde los parámetros de la ruta
    const query = `
        SELECT 
            productos.id,
            productos.nombre,
            productos.descripcion,
            productos.precio,
            productos.imagen,
            categorias.nombre AS categoria_nombre
        FROM 
            productos
        JOIN 
            categorias ON productos.categoria_id = categorias.id
        WHERE 
            productos.categoria_id = ?
    `;
    db.query(query, [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
const getAllProducts = (req, res) => {
    const query = `
        SELECT 
            productos.id,
            productos.nombre,
            productos.descripcion,
            productos.precio,
            productos.imagen,
            categorias.nombre AS categoria_nombre
        FROM 
            productos
        JOIN 
            categorias ON productos.categoria_id = categorias.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Producto no encontrado
 */
const getProductById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(results[0]);
    });
};

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto con imagen
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria_id:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: ID de categoría inválido
 *       500:
 *         description: Error del servidor
 */
const createProduct = (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;  // Imagen subida por Multer

    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'ID de categoría inválido' });
        }
        db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen) VALUES (?, ?, ?, ?, ?)', 
        [nombre, descripcion, precio, categoria_id, imagen], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Producto creado', productId: results.insertId });
        });
    });
};

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria_id:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: ID de categoría inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'ID de categoría inválido' });
        }
        db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?, imagen = ? WHERE id = ?', 
        [nombre, descripcion, precio, categoria_id, imagen, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto actualizado' });
        });
    });
};

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
const deleteProduct = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    upload,
    getProductsByCategory
};
