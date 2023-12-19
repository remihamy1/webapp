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

  const itemsPerPage = 9; // Set the number of products to display per page
  let currentPage = 1; // Current page
  
  function loadProducts() {
    const productsDiv = document.getElementById("liste-produits");
    productsDiv.innerHTML = ""; // Clear the existing products
  
    fetch(`${baseUrl}/products?_page=${currentPage}&_limit=${itemsPerPage}`)
      .then((response) => {
        const linkHeader = response.headers.get("Link");
        const totalItems = parseInt(response.headers.get("X-Total-Count"));
  
        updatePaginationControls(totalItems);
  
        return response.json();
      })
      .then((products) => {
        products.forEach((product) => {
          fetch(`${baseUrl}/reviews?productId=${product.id}`)
            .then((response) => response.json())
            .then((reviews) => {
              const productDiv = document.createElement("div");
              productDiv.className = "product-item";
              productDiv.innerHTML = `
                              <h3 class="product-name">${product.name}</h3>
                              <p class="product-description">${
                                product.description
                              }</p>
                              <p class="product-price">${product.price} €</p>
                              <div class="product-reviews">${generateReviewSummary(
                                reviews
                              )}</div>
                          `;
              productDiv.onclick = () => showProductDetail(product.id);
              productsDiv.appendChild(productDiv);
            });
        });
      })
      .catch((error) => console.error("Error loading products:", error));
  }
  
  function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationDiv = document.querySelector(".pagination");
    paginationDiv.innerHTML = ""; // Clear existing pagination controls
  
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.onclick = () => {
        currentPage = i;
        loadProducts();
      };
  
      if (i === currentPage) {
        pageLink.classList.add("active");
      }
  
      paginationDiv.appendChild(pageLink);
    }
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