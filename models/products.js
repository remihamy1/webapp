class Products {
    id;
    name;
    description;
    price;
    categoryId;
  
    constructor(name, description, price, categoryId) {
      this.name = name;
      this.description = description;
      this.price = price;
      this.categoryId = categoryId;
    }
  
    static async #getLastProductsId() {
      try {
        const response = await fetch(`${baseUrl}/products`);
        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }
        const products = await response.json();
        const lastProducts = products[products.length - 1];
        return lastProducts ? lastProducts.id : 0; // If no products exist, start ID from 0
      } catch (error) {
        console.error("Error fetching products:", error.message);
        return 0;
      }
    }
  
    static async getAll() {
      try {
        const response = await fetch(`${baseUrl}/products`);
        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }
        const products = await response.json();
        return products;
      } catch (error) {
        console.error("Error fetching products:", error.message);
        return [];
      }
    }
  
    async getById(id) {
      try {
        const response = await fetch(`${baseUrl}/products/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to retrieve Products");
        }
        const Products = await response.json();
        console.log(Products)
        return Products
      } catch (error) {
        console.error("Error getting Products:", error.message);
        return null;
      }
    }
  
    async save() {
      try {
        const lastProductsId = await Products.#getLastProductsId();
        this.id = lastProductsId + 1;
  
        const response = await fetch(`${baseUrl}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this),
        });
        if (!response.ok) {
          throw new Error("Failed to create Products");
        }
        const createdProducts = await response.json();
        return createdProducts;
      } catch (error) {
        console.error("Error creating Products:", error.message);
        return null;
      }
    }
  
    async delete() {
      try {
        const response = await fetch(`${baseUrl}/products/${this.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete Products");
        }
        return true;
      } catch (error) {
        console.error("Error deleting Products:", error.message);
        return false;
      }
    }
  
    async update(updatedProducts) {
      try {
        const response = await fetch(`${baseUrl}/products/${this.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProducts),
        });
        if (!response.ok) {
          throw new Error("Failed to update Products");
        }
        const updated = await response.json();
        return updated;
      } catch (error) {
        console.error("Error updating Products:", error.message);
        return null;
      }
    }
  }