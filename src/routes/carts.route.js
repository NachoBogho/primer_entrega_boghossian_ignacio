import express from 'express';
const router = express.Router();
import CartManager from '../manager/cart_manager.js';

const cartManager = new CartManager('carritos.json');

router.post('/', async (req, res) => {
  try {
    const newCartId = await cartManager.createCart();
    res.json({ message: 'Carrito creado correctamente', newCartId });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al crear carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; // Cantidad predeterminada es 1

  try {
    const success = await cartManager.addProductToCart(cartId, productId, quantity);
    if (success) {
      res.json({ message: 'Producto agregado al carrito correctamente', cartId, productId });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;