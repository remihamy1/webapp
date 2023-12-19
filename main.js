const baseUrl = "http://localhost:3000"; // URL de votre JSON Server

//Load initial des produits sur la page principal
loadProducts();

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

loadCategories();

// Appel initial pour vérifier l'état de la session
updateLoginState();

function submitContactForm(event) {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const orderNumber = document.getElementById("order-number")
    ? document.getElementById("order-number").value
    : null; // Récupération du numéro de commande si présent
  const message = document.getElementById("message").value;

  // Expression régulière pour valider l'email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !subject ||
    !message ||
    !emailPattern.test(email)
  )
    event.preventDefault(); // Empêche l'envoi du formulaire si les conditions ne sont pas remplies

  showAlert("Votre demande a été soumise avec succès.");
}

function showContactForm() {
  const showContactFormButton = document.getElementById(
    "show-contact-form-button"
  );
  const contactForm = document.getElementById("contact-form");

  contactForm.style.display = "block";
  showContactFormButton.style.display = "none";
  if (getCurrentUser() != null) {
    let orderNumberField = document.getElementById("order-number-field");

    orderNumberField.style.display = "block";

    let currentUser = getCurrentUser();

    fetch(`${baseUrl}/users/${currentUser.id}/orders`)
      .then((response) => response.json())
      .then((orders) => {
        let orderNumberSelect = document.getElementById("order-number");

        // Efface toutes les options existantes
        orderNumberSelect.innerHTML = "";

        // Ajoute une option pour chaque commande
        orders.forEach((order) => {
          let option = document.createElement("option");
          option.value = order.id; // Assure-toi que "orderNumber" est le champ approprié dans tes données d'ordre
          option.textContent = `Commande ${order.id}`;
          orderNumberSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commandes :", error);
      });
  }
}

function showAlert(message) {
  const alert = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;
  alert.style.display = "block";
}

function closeAlert() {
  const alert = document.getElementById("custom-alert");
  alert.style.display = "none";
}

function closeModal() {
  document.getElementById("product-detail-modal").style.display = "none";
}