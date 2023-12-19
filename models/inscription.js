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

async function isEmailRegistered(email) {
    const response = await fetch(`${baseUrl}/users?email=${email}`);
    const users = await response.json();
    return users.length > 0;
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

    // Vérifier si l'email est déjà enregistré
    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
        alert("Un compte avec cet email existe déjà.");
        return;
    }
    // Hacher le mot de passe avant de l'envoyer
    const hashedPassword = await hashPassword(password);

    // Créer une nouvelle instance d'utilisateur avec le mot de passe haché
    const newUser = new Utilisateur(username, hashedPassword, email, "customer");
    console.log("hello  ", newUser);
    // Sauvegarder le nouvel utilisateur dans la base de données
    const createdUser = await newUser.save();
    console.log("hello  ", createdUser);
    if (createdUser) {
        alert('Inscription réussie');
        closeRegisterPopup();
    } else {
        alert('Échec de l\'inscription');
    }
}

function closeRegisterPopup() {
    document.getElementById('register-popup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher le formulaire de s'envoyer automatiquement
        register();
    });
});

document.getElementById('open-register-popup').addEventListener('click', () => {
    document.getElementById('register-popup').style.display = 'block';
});