class Category {
  id;
  name;

  constructor(name) {
    this.name = name;
  }

  static async #getLastCategoryId() {
    try {
      const response = await fetch(`${baseUrl}/categories`);
      if (!response.ok) {
        throw new Error("Unable to fetch categories");
      }
      const categories = await response.json();
      const lastCategory = categories[categories.length - 1];
      return lastCategory ? lastCategory.id : 0; // If no categories exist, start ID from 0
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return 0;
    }
  }

  static async getAll() {
    try {
      const response = await fetch(`${baseUrl}/categories`);
      if (!response.ok) {
        throw new Error("Unable to fetch categories");
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${baseUrl}/categories/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve category");
      }
      const category = await response.json();
      return category;
    } catch (error) {
      console.error("Error getting category:", error.message);
      return null;
    }
  }

  async save() {
    try {
      const lastCategoryId = await Category.#getLastCategoryId();
      this.id = lastCategoryId + 1;

      const response = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      const createdCategory = await response.json();
      return createdCategory;
    } catch (error) {
      console.error("Error creating category:", error.message);
      return null;
    }
  }

  async delete() {
    try {
      const response = await fetch(`${baseUrl}/categories/${this.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      return true;
    } catch (error) {
      console.error("Error deleting category:", error.message);
      return false;
    }
  }

  async update(updatedCategory) {
    try {
      const response = await fetch(`${baseUrl}/categories/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      const updated = await response.json();
      return updated;
    } catch (error) {
      console.error("Error updating category:", error.message);
      return null;
    }
  }
}

function loadCategories() {
  Category.getAll()
    .then((categories) => {
      const categoriesDiv = document.getElementById("categories");
      categoriesDiv.innerHTML = "";
      categories.forEach((category) => {

        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        categoryDiv.id = "category_" + category.id;

        const categoryName = document.createElement("span");
        categoryName.textContent = category.name;
        categoryDiv.appendChild(categoryName);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.onclick = () => deleteCategory(category.id);
        categoryDiv.appendChild(deleteButton);

        categoryDiv.onclick = () => loadProducts(category.id);
        categoriesDiv.appendChild(categoryDiv);
      });
    });
}

function loadCategories() {
  Category.getAll()
    .then((categories) => {
      const categoriesDiv = document.getElementById("categories");
      categoriesDiv.innerHTML = "";
      categories.forEach((category) => {

        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-container";

        const categoryName = document.createElement("span");
        categoryName.textContent = category.name;
        categoryDiv.appendChild(categoryName);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.className = "delete-button-category";
        deleteButton.onclick = () => deleteCategory(category.id);
        categoryDiv.appendChild(deleteButton);

        categoryDiv.onclick = () => loadProducts(category.id);
        categoriesDiv.appendChild(categoryDiv);
      });
    });
}

function addCategory() {

  const categoryNameInput = document.getElementById('category-name');
  const newCategory = new Category(categoryNameInput.value);

  newCategory.save();
  window.location.reload();
}

function deleteCategory(categoryId) {
  const category = new Category();
  category.id = categoryId;

  category.delete();
  window.location.reload();
}