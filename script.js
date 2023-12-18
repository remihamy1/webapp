const baseUrl = "http://localhost:3000"; // URL de votre JSON Server

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

const itemsPerPage = 5; // Set the number of products to display per page
let currentPage = 1; // Current page

function loadProducts(categoryId) {
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

function generateReviewSummary(reviews) {
  if (reviews.length === 0) return "Pas d'avis pour ce produit.";
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 1) /
    (reviews.length - 1);
  return `Note moyenne : ${averageRating.toFixed(1)} (${reviews.length} avis)`;
}

function updateBreadcrumb(categoryName) {
  const breadcrumbDiv = document.getElementById("breadcrumb");
  breadcrumbDiv.innerHTML = `<span class="breadcrumb-item">Accueil</span> / <span class="breadcrumb-item">${categoryName}</span>`;
}
function searchProducts() {
  const searchText = document.getElementById("search-box").value.toLowerCase();
  fetch(`${baseUrl}/products`)
    .then((response) => response.json())
    .then((products) => {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText)
      );
      displayProducts(filteredProducts);
    });
}
function displayProducts(products) {
  const productsDiv = document.getElementById("liste-produits");
  productsDiv.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product-item";
    productDiv.innerHTML = `
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price} €</p>
        `;
    productDiv.onclick = () => showProductDetail(product.id); // Ajout de l'événement onclick
    productsDiv.appendChild(productDiv);
  });
}
loadCategories();

let cart = [];

function addToCart(productId) {
  fetch(`${baseUrl}/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      cart.push(product);
      displayCart();
    });
}

function displayCart() {
  const cartDiv = document.getElementById("cart-items");
  cartDiv.innerHTML = "";
  cart.forEach((product) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.innerHTML = `${product.name} - ${product.price} €`;
    cartDiv.appendChild(cartItemDiv);
  });
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${baseUrl}/users?username=${username}&password=${password}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        sessionStorage.setItem("user", JSON.stringify({ username: "unknown" }));
        updateLoginState();
      } else {
        alert("Échec de la connexion.");
      }
    });
}

function updateLoginState() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("welcome-message").style.display = "block";
    document.getElementById("user-name").textContent = user.username;
  } else {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("welcome-message").style.display = "none";
  }
}

function logout() {
  sessionStorage.removeItem("user");
  updateLoginState();
}

// Appel initial pour vérifier l'état de la session
updateLoginState();

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

function closeModal() {
  document.getElementById("product-detail-modal").style.display = "block";
}
