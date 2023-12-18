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