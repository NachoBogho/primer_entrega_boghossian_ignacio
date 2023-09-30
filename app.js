import express from 'express';
import productsRouter from './src/routes/products.route.js'; // Ajusta la ruta según tu estructura de archivos.
import cartsRouter from './src/routes/carts.route.js'; // Ajusta la ruta según tu estructura de archivos.

const app = express();
const port = 8080;

app.use(express.json());

// Usa el router de productos en la ruta /api/products
app.use('/api/products', productsRouter);

// Usa el router de carritos en la ruta /api/carts
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});


