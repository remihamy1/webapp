function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!validatePassword(password)) {
    alert(
      "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial."
    );
    return;
  }

  fetch(`${baseUrl}/users?username=${username}&password=${password}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        let currentUser = users[0];

        sessionStorage.setItem(
          "user",
          JSON.stringify({ username: username, id: currentUser.id })
        );
        updateLoginState();
      } else {
        alert("Échec de la connexion.");
      }
    });
}

function getCurrentUser() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user; // Renvoie true si un utilisateur est connecté, sinon false
}

function validatePassword(password) {
  // Au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial
  var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
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

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher le formulaire de s'envoyer automatiquement
    register(); // Notez que `register` est maintenant une fonction asynchrone
  });
});

document.getElementById('open-register-popup').addEventListener('click', () => {
  document.getElementById('register-popup').style.display = 'block';
});

function closeRegisterPopup() {
  document.getElementById('register-popup').style.display = 'none';
}