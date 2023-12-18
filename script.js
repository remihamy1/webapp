const baseUrl = 'http://localhost:3000'; // URL de votre JSON Server

function loadCategories() {
    fetch(`${baseUrl}/categories`)
        .then(response => response.json())
        .then(categories => {
            const categoriesDiv = document.getElementById('categories');
            categoriesDiv.innerHTML = '';
            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';
                categoryDiv.textContent = category.name;
                categoryDiv.onclick = () => loadProducts(category.id);
                categoriesDiv.appendChild(categoryDiv);
            });
        });
}

function loadProducts(categoryId) {
    fetch(`${baseUrl}/products`)
    .then(response => response.json())
    .then(products => {
        const productsDiv = document.getElementById('liste-produits');
        productsDiv.innerHTML = ''; // Nettoyer les anciens produits
        products.forEach(product => {
            fetch(`${baseUrl}/reviews?productId=${product.id}`)
                .then(response => response.json())
                .then(reviews => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product-item';
                    productDiv.innerHTML = `
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">${product.price} €</p>
                        <div class="product-reviews">${generateReviewSummary(reviews)}</div>
                    `;
                    productDiv.onclick = () => showProductDetail(product.id);
                    productsDiv.appendChild(productDiv);
                });
        });
    });
    fetch(`${baseUrl}/categories/1`)
    .then(response => response.json())
    .then(category => updateBreadcrumb(category.name));
}

function generateReviewSummary(reviews) {
    if (reviews.length === 0) return 'Pas d\'avis pour ce produit.';
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 1) / (reviews.length - 1);
    return `Note moyenne : ${averageRating.toFixed(1)} (${reviews.length} avis)`;
}

function updateBreadcrumb(categoryName) {
    const breadcrumbDiv = document.getElementById('breadcrumb');
    breadcrumbDiv.innerHTML = `<span class="breadcrumb-item">Accueil</span> / <span class="breadcrumb-item">${categoryName}</span>`;
}
function searchProducts() {
    const searchText = document.getElementById('search-box').value.toLowerCase();
    fetch(`${baseUrl}/products`)
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
            displayProducts(filteredProducts);
        });
}
function displayProducts(products) {
    const productsDiv = document.getElementById('liste-produits');
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
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
        .then(response => response.json())
        .then(product => {
            cart.push(product);
            displayCart();
        });
}

function displayCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    cart.forEach(product => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.innerHTML = `${product.name} - ${product.price} €`;
        cartDiv.appendChild(cartItemDiv);
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${baseUrl}/users?username=${username}&password=${password}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                sessionStorage.setItem('user', JSON.stringify({ username: users[0].username }));
                updateLoginState();
            } else {
                alert("Échec de la connexion.");
            }
        });
}

function updateLoginState() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('user-name').textContent = user.username;
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('welcome-message').style.display = 'none';
    }
}

function logout() {
    sessionStorage.removeItem('user');
    updateLoginState();
}

// Appel initial pour vérifier l'état de la session
updateLoginState();

function showProductDetail(productId) {
    fetch(`${baseUrl}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('product-detail-name').textContent = "Nom du produit incorrect";
            document.getElementById('product-detail-description').textContent = "Description incorrecte";
            document.getElementById('product-detail-price').textContent = `${product.price} €`;
            document.getElementById('product-detail-modal').style.display = 'block';
        });
}

function closeModal() {
    document.getElementById('product-detail-modal').style.display = 'block';
}