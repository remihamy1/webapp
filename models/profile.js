function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (!validatePassword(password)) {
      showAlert(
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
            JSON.stringify({ username: username, id: currentUser.id, email: currentUser.email, role: currentUser.role})
            );
          updateLoginState();
        } else {
          showAlert("Échec de la connexion.");
        }
      });
  }

  fetch(`${baseUrl}/users?username=${username}&password=${password}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        let currentUser = users[0];

        sessionStorage.setItem(
          "user",
          JSON.stringify({ username: username, id: currentUser.id, email: currentUser.email, role: currentUser.role})
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
    document.getElementById("logout-container").style.display = "block";
    document.getElementById("welcome-message").style.display = "block";
    document.getElementById("panier").style.display = "block";
    document.getElementById("user-name").textContent = user.username;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-role").textContent = user.role;

  } else {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("logout-container").style.display = "none";
    document.getElementById("panier").style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
  }
  
  function validatePassword(password) {
    // Au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial
    var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
  
  function updateLoginState() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user && user.role === "admin") {
      document.getElementById("add-categorie").style.display = "block";

      var elements = document.getElementsByClassName("delete-button-category");
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }    

    } else {
      document.getElementById("add-categorie").style.display = "none";

      var elements = document.getElementsByClassName("delete-button-category");
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }    
    }

    if (user) {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("logout-container").style.display = "block";
      document.getElementById("welcome-message").style.display = "block";
      document.getElementById("panier").style.display = "block";
      document.getElementById("user-name").textContent = user.username;
    } else {
      document.getElementById("login-container").style.display = "block";
      document.getElementById("logout-container").style.display = "none";
      document.getElementById("panier").style.display = "none";
      document.getElementById("welcome-message").style.display = "none";
    }
  }
  
  function logout() {
    sessionStorage.removeItem("user");
    updateLoginState();
  }