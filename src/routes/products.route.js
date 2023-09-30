import express from 'express';
const router = express.Router();
import fs from 'fs/promises';

// Función para obtener productos desde el archivo
const getProducts = async () => {
  const data = await fs.readFile('productos.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar productos en el archivo
const saveProducts = async (products) => {
  await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
};

// Función para generar un nuevo ID único
const generateId = (existingItems) => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (existingItems.some((item) => item.id === newId));
  return newId;
};

// Ruta raíz GET para listar todos los productos
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const products = await getProducts();
    res.json(limit ? products.slice(0, limit) : products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Ruta GET /:pid para obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const products = await getProducts();
    const product = products.find((p) => p.id.toString() === productId.toString());
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Ruta POST / para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await getProducts();
    const newProductId = generateId(products);
    newProduct.id = newProductId;
    products.push(newProduct);
    await saveProducts(products);
    res.json({ message: 'Producto agregado correctamente', newProductId });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Ruta PUT /:pid para actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const products = await getProducts();
    const index = products.findIndex((p) => p.id.toString() === productId.toString());
    if (index !== -1) {
      updatedProduct.id = products[index].id;
      products[index] = updatedProduct;
      await saveProducts(products);
      res.json({ message: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Ruta DELETE /:pid para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const products = await getProducts();
    const updatedProducts = products.filter((p) => p.id.toString() !== productId.toString());
    await saveProducts(updatedProducts);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
