import fs from 'fs/promises';

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      return [];
    }
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
  }

  async generateUniqueId(existingItems) {
    let newId;
    do {
      newId = Math.floor(Math.random() * 1000000);
    } while (existingItems.some((item) => item.id === newId));
    return newId;
  }

  async createCart() {
    const newCart = {
      id: await this.generateUniqueId([]),
      products: [],
    };
    const carts = await this.loadCarts();
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart.id;
  }

  async getCartById(cartId) {
    const carts = await this.loadCarts();
    return carts.find((c) => c.id.toString() === cartId.toString()) || null;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.loadCarts();
    const cartIndex = carts.findIndex((c) => c.id.toString() === cartId.toString());

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product.toString() === productId.toString()
      );

      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        carts[cartIndex].products.push({
          product: productId,
          quantity: quantity,
        });
      }

      await this.saveCarts(carts);
      return true;
    } else {
      return false;
    }
  }
}

export default CartManager;
