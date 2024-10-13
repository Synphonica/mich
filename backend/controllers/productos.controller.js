// Importar el modelo de productos (asegúrate de ajustar la ruta según tu estructura de proyecto)
const db = require("../db/db");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones relacionadas con productos
 */

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
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(results[0]);
    });
};

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, categoria_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Product created', productId: results.insertId });
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
 *         application/json:
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
    db.query('SELECT * FROM categorias WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?', [nombre, descripcion, precio, categoria_id, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated' });
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
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    });
};

// Exportar las funciones del controlador
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};