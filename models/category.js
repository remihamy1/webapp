function loadCategories() {
    fetch(`${baseUrl}/categories`)
      .then((response) => response.json())
      .then((categories) => {
        const categoriesDiv = document.getElementById("categories");
        categoriesDiv.innerHTML = "";
        categories.forEach((category) => {
          const categoryDiv = document.createElement("div");
          categoryDiv.className = "category";
          categoryDiv.textContent = category.name;
          categoryDiv.onclick = () => loadProducts(category.id);
          categoriesDiv.appendChild(categoryDiv);
        });
      });
  }