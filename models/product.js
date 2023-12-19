function generateProductDiv(product, reviews) {
    const productDiv = document.createElement("div");
    productDiv.className = "product-item";
    productDiv.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price} €</p>
        <div class="product-reviews">${generateReviewSummary(reviews)}</div>
      `;
    productDiv.onclick = () => showProductDetail(product.id);
    return productDiv;
  }

  function loadProductsInitial() {
    fetch(`${baseUrl}/products`)
      .then((response) => response.json())
      .then((products) => {
        const productsDiv = document.getElementById("liste-produits");
        productsDiv.innerHTML = ""; // Nettoyer les anciens produits
        products.forEach((product) => {
          fetch(`${baseUrl}/reviews?productId=${product.id}`)
            .then((response) => response.json())
            .then((reviews) => {
              const productDiv = document.createElement("div");
              productDiv.className = "product-item";
              productDiv.innerHTML = `
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">${product.price} €</p>
                        <div class="product-reviews">${generateReviewSummary(
                          reviews
                        )}</div>
                    `;
              productDiv.onclick = () => showProductDetail(product.id);
              productsDiv.appendChild(productDiv);
            });
        });
      });
    fetch(`${baseUrl}/categories/1`)
      .then((response) => response.json())
      .then((category) => updateBreadcrumb(category.name));
  }

  
function loadProducts(categoryId) {
    fetch(`${baseUrl}/products`)
      .then((response) => response.json())
      .then((products) => {
        if (categoryId != null) {
          products = products.filter((product) => product.categoryId == categoryId);
        }
        const productsDiv = document.getElementById("liste-produits");
        productsDiv.innerHTML = ""; // Clear old products
        products.forEach((product) => {
          fetch(`${baseUrl}/reviews?productId=${product.id}`)
            .then((response) => response.json())
            .then((reviews) => {
              const productDiv = generateProductDiv(product, reviews);
              productsDiv.appendChild(productDiv);
            });
        });
      });
    fetch(`${baseUrl}/categories/1`)
      .then((response) => response.json())
      .then((category) => updateBreadcrumb(category.name));
  }

  function searchProducts() {
    const searchText = document.getElementById("search-box").value.toLowerCase();
    fetch(`${baseUrl}/products`)
      .then((response) => response.json())
      .then((products) => {
        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(searchText)
        );
  
        const productsDiv = document.getElementById("liste-produits");
        productsDiv.innerHTML = "";
        const fetchPromises = filteredProducts.map((product) => {
          return fetch(`${baseUrl}/reviews?productId=${product.id}`)
            .then((response) => response.json())
            .then((reviews) => {
              const productDiv = generateProductDiv(product, reviews);
              productsDiv.appendChild(productDiv);
            });
        });
        Promise.all(fetchPromises).then(() => {});
      });
  }
  
  function displayProducts(products) {
    const productsDiv = document.getElementById("liste-produits");
    productsDiv.innerHTML = "";
    products.forEach((product) => {
      const productDiv = generateProductDiv(product, []);
      productsDiv.appendChild(productDiv);
    });
  }

  function showProductDetail(productId) {
    fetch(`${baseUrl}/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("product-detail-name").textContent =
          "Nom du produit incorrect";
        document.getElementById("product-detail-description").textContent =
          "Description incorrecte";
        document.getElementById(
          "product-detail-price"
        ).textContent = `${product.price} €`;
        document.getElementById("product-detail-modal").style.display = "block";
      });
  }

  function filteredProducts(){
    const searchPrix = document.getElementById('maxPrice').value.toLowerCase();

    fetch(`${baseUrl}/products`)
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product => product.price < searchPrix);
            displayProducts(filteredProducts);
        });
    
}