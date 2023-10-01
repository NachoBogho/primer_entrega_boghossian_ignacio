// carts.route.js

import express from 'express';
const router = express.Router();
import fs from 'fs/promises';

// Función para obtener carritos desde el archivo
const getCarts = async () => {
  const data = await fs.readFile('carritos.json', 'utf-8');
  return JSON.parse(data);
};

// Función para guardar carritos en el archivo
const saveCarts = async (carts) => {
  await fs.writeFile('carritos.json', JSON.stringify(carts, null, 2), 'utf-8');
};

// Función para generar un nuevo ID único
const generateId = (existingItems) => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (existingItems.some((item) => item.id === newId));
  return newId;
};

// Ruta POST / para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = {
      id: generateId([]),
      products: [],
    };
    const carts = await getCarts();
    carts.push(newCart);
    await saveCarts(carts);
    res.json({ message: 'Carrito creado correctamente', newCartId: newCart.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// Ruta GET /:cid para obtener los productos de un carrito por ID
router.get('/', async (req, res) => {
    try {
      const carts = await getCarts();
      res.json(carts);
    } catch (error) {
      console.error('Error al obtener la lista de carritos:', error);
      res.status(500).json({ error: 'Error al obtener la lista de carritos' });
    }
  });

// Ruta POST /:cid/product/:pid para agregar un producto a un carrito por ID
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const carts = await getCarts();
    const cartIndex = carts.findIndex((c) => c.id.toString() === cartId.toString());

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product.toString() === productId.toString()
      );

      if (productIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementa la cantidad
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        // Si el producto no existe, agrégalo al carrito con cantidad 1
        carts[cartIndex].products.push({
          product: productId,
          quantity: 1,
        });
      }

      await saveCarts(carts);
      res.json({ message: 'Producto agregado al carrito correctamente', cartId, productId });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;
