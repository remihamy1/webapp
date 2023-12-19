const baseUrl = "http://localhost:3000"; // URL de votre JSON Server

//Load initial des produits sur la page principal
loadProductsInitial();

function generateReviewSummary(reviews) {
  if (reviews.length === 0) return "Pas d'avis pour ce produit.";
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 1) /
    (reviews.length - 1);
  return `Note moyenne : ${averageRating.toFixed(1)} (${reviews.length} avis)`;
}

function updateBreadcrumb(categoryName) {
  const breadcrumbDiv = document.getElementById("breadcrumb");
  breadcrumbDiv.innerHTML = `<span class="breadcrumb-item"><a href="#accueil">Accueil</a></span> / <span class="breadcrumb-item"><a href="#produits">${categoryName}</a</span>`;
}

loadCategories();

// Appel initial pour vérifier l'état de la session
updateLoginState();

function CustomAlert() {
  this.alert = function (message, title) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot"></div></div></div>';

    let dialogoverlay = document.getElementById("dialogoverlay");
    let dialogbox = document.getElementById("dialogbox");

    let winH = window.innerHeight;
    dialogoverlay.style.height = winH + "px";

    dialogbox.style.top = "100px";

    dialogoverlay.style.display = "block";
    dialogbox.style.display = "block";

    document.getElementById("dialogboxhead").style.display = "block";

    if (typeof title === "undefined") {
      document.getElementById("dialogboxhead").style.display = "none";
    } else {
      document.getElementById("dialogboxhead").innerHTML =
        '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;
    }
    document.getElementById("dialogboxbody").innerHTML = message;
    document.getElementById("dialogboxfoot").innerHTML =
      '<button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>';
  };

  this.ok = function () {
    document.getElementById("dialogbox").style.display = "none";
    document.getElementById("dialogoverlay").style.display = "none";
  };
}

let customAlert = new CustomAlert();

function showAlert(message) {
  customAlert.alert(message);
}

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

function closeModal() {
  document.getElementById("product-detail-modal").style.display = "none";
}

updatePageForRole();

// Appel initial pour afficher les commandes existantes
displayOrders();
