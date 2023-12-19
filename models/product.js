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
        products = products.filter(
          (product) => product.categoryId == categoryId
        );
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

async function createdProducts() {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const categoryId = document.getElementById("categoryId").value;

  const newProducts = new Products(name, description, price, categoryId);

  const createdProducts = await newProducts.saveProduct();

  if (createdProducts) {
    showAlert("Produits ajouté avec succès");
  }
}



// Modifie la visibilité du formulaire d'édition et pré-remplit les champs avec les données de la produit sélectionnée
function showUpdateForm(productId, name, description, price) {
  document.getElementById("edit-product-id").value = productId;
  document.getElementById("edit-product-name").value = name;
  document.getElementById("edit-product-description").value = description;
  document.getElementById("edit-product-price").value = price;

  const updateForm = document.getElementById("update-product-form");
  updateForm.style.display = "block";
}

async function updateproduct() {
  const productId = document.getElementById("edit-product-id").value;
  const name = document.getElementById("edit-product-name").value;
  const description = document.getElementById("edit-product-description").value;
  const price = document.getElementById("edit-product-price").value;
  

  const product = await Products.getById(productId);
  product.name = name;
  product.description = description;
  product.price = price;

  const updated = await Products.update();

  if (updated) {
    showAlert("produit mise à jour avec succès!");

    // Actualiser la liste des produit après la mise à jour
    displayproducts();
  } else {
    showAlert("Erreur lors de la mise à jour du produit.");
  }

  // Masquer le formulaire d'édition après la mise à jour
  const updateForm = document.getElementById("update-product-form");
  updateForm.style.display = "none";
}

// Fonction pour afficher toutes les produits existantes
async function displayproducts() {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  const products = await Products.getAll();

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.id = `product-list-item-${product.id}`;
    listItem.style = "margin-top: 1rem; margin-bottom: 1rem;";
    listItem.textContent = `ID: ${product.id}, name: ${product.name}, description: ${product.description}, price: ${product.price}`;

    const editButton = document.createElement("button");
    editButton.style = "margin-right: 1rem; margin-left: 1rem;";
    editButton.textContent = "Edit";
    editButton.onclick = () => {
      // Afficher le formulaire d'édition avec les données de la commande sélectionnée
      showUpdateForm(product.id, product.name, product.description, product.price);
    };
    listItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.onclick = async () => {
      const productToDelete = await Products.getById(product.id);
      const deleted = await productToDelete.deleteProduct();
      if (deleted) {
        displayproducts();
        showAlert("Commande supprimée!");
      } else
        showAlert(
          "Une erreur s'est produite lors de la suppression de la commande."
        );
    };
    listItem.appendChild(deleteButton);

    productsList.appendChild(listItem);
  });
}
