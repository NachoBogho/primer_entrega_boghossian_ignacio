import fs from 'fs/promises';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      return [];
    }
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }

  async addProduct(product) {
    const products = await this.loadProducts();
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    product.id = lastId + 1;

    products.push(product);
    await this.saveProducts(products);
  }

  async getProducts() {
    return await this.loadProducts();
  }

  async getProductById(id) {
    const products = await this.loadProducts();
    return products.find((p) => p.id === id) || null;
  }

  async updateProduct(id, updatedProduct) {
    const products = await this.loadProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      updatedProduct.id = products[index].id;
      products[index] = updatedProduct;
      await this.saveProducts(products);
      return true;
    }

    return false;
  }

  async deleteProduct(id) {
    const products = await this.loadProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index !== -1) {
      products.splice(index, 1);
      await this.saveProducts(products);
      return true;
    }

    return false;
  }
}

export default ProductManager;