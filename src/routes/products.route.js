import express from 'express';
const router = express.Router();
import ProductManager from '../manager/product_manager.js';

const productManager = new ProductManager('productos.json');

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit);

  try {
    const products = await productManager.getProducts();
    if (!isNaN(limit)) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;

  try {
    await productManager.addProduct(newProduct);
    res.json({ message: 'Producto agregado correctamente', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  try {
    const success = await productManager.updateProduct(productId, updatedProduct);
    if (success) {
      res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    const success = await productManager.deleteProduct(productId);
    if (success) {
      res.json({ message: 'Producto eliminado correctamente', productId });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;