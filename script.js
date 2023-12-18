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

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash)); // convertit le buffer en tableau octet
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // convertit le tableau en chaîne hexadécimale
    return hashHex;
}


function validatePassword(password) {
    // Au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial
    var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;

    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    if (!validatePassword(password)) {
        alert("Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial.");
        return;
    }

    // Hacher le mot de passe avant de l'envoyer
    const hashedPassword = await hashPassword(password);

    const newUser = {
        username: username,
        password: hashedPassword,
        email: email,
        role: "customer"
    };

    // Envoi de la requête d'inscription au serveur
    try {
        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            throw new Error('Échec de la création du compte');
        }

        const user = await response.json();
        alert('Inscription réussie');
        // Autres actions après une inscription réussie...
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Échec de l\'inscription : ' + error.message);
    }
}


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${baseUrl}/users?username=${username}&password=${password}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                sessionStorage.setItem('user', JSON.stringify({ username: 'unknown' }));
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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher le formulaire de s'envoyer automatiquement
        register(); // Notez que `register` est maintenant une fonction asynchrone
    });
});