class Utilisateur {
    id;
    username;
    password;
    email;
    role;

    constructor(username, password, email, role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

  
    static async #getLastUserId() {
        try {
            const response = await fetch(`${baseUrl}/users`);
            if (!response.ok) {
                throw new Error("Unable to fetch users");
            }
            const users = await response.json();
            const lastUsers = users[users.length - 1];
            return lastUsers ? lastUsers.id : 0;
        } catch (error) {
            console.error("Error fetching users:", error.message);
            return 0;
        }
    }
    
    static async getAll() {
        try {
            const response = await fetch(`${baseUrl}/users`);
            if (!response.ok) {
                throw new Error("Unable to fetch users");
            }
    
            const usersData = await response.json();
            if (Array.isArray(usersData)) {
                const users = usersData.map((userData) => {
                    const user = new User();
    
                    Object.assign(user, userData)
    
                    return user;
                });
    
                return users;
            } else {
                throw new Error("Users data is invalid");
            }
        } catch (error) {
            console.error("Error fetching users:", error.message);
            return [];
        }
    }
    
    static async getById(id) {
        try {
            const response = await fetch(`${baseUrl}/users/${id}`, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Failed to retrieve user");
            }
    
            const userData = await response.json();
            if (userData) {
                const user = new User(); // Crée une instance vide de user
    
                // Assigner les propriétés de userData à l'instance de user
                Object.assign(user, userData);
    
                return user;
            } else {
                throw new Error("User data is invalid");
            }
        } catch (error) {
            console.error("Error getting user:", error.message);
            return null;
        }
    }
    
    async save() {
        try {
            const lastUserId = await User.#getLastUserId();
            this.id = lastUserId + 1;
    
            const body = {};
            Object.assign(body, this);
    
            const response = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create user");
            }
    
            const createdUser = await response.json();
            if (createdUser) {
                const user = new User(); // Crée une instance vide de user
    
                // Assigner les propriétés de createduser à l'instance de user
                Object.assign(user, createdUser);
    
                return user;
            } else {
                throw new Error("user data is invalid");
            }
        } catch (error) {
            console.error("Error creating user:", error.message);
            return null;
        }
    }
    
    async delete() {
        try {
            const response = await fetch(`${baseUrl}/users/${this.id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            return true;
        } catch (error) {
            console.error("Error deleting user:", error.message);
            return false;
        }
    }
    
    async update() {
        try {
            const body = {};
            Object.assign(body, this);
    
            const response = await fetch(`${baseUrl}/users/${this.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error("Failed to update user");
            }
            const updated = await response.json();
            if (updated) {
                const user = new User();
    
        
                Object.assign(user, updated);
    
                return user;
            } else {
                throw new Error("User data is invalid");
            }
        } catch (error) {
            console.error("Error updating user:", error.message);
            return null;
        }
    }
}
    async function createU() {
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const email = document.getElementById("email").value;
        const role = document.getElementById("role").value;

        const newUser = new User(username, password, email, role);
        const createdUser = await newUser.save();
            
        if (createdUser) {
          showAlert("User créée avec succès!");
      
          displayUsers();
        }
    }
    
    function showUpdateForm(username, password, email, role) {
        document.getElementById("username").value = username;
        document.getElementById("password").value = password;
        document.getElementById("email").value = email;
        document.getElementById("role").value = role;
            
        const updateForm = document.getElementById("update-user-form");
        updateForm.style.display = "block";
}
      
async function updateUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    
    const user = await user.getById(username);
    user.username = username;
    user.password = password;
    user.email = email;
    user.role = role;
    
  
    console.log(user);
    const updated = await user.update();
  
    if (updated) {
      showAlert("User mise à jour avec succès!");
  
      // Actualiser la liste des commandes après la mise à jour
      displayUsers();
    } else {
      showAlert("Erreur lors de la mise à jour de l'user.");
    }
  
    // Masquer le formulaire d'édition après la mise à jour
    const updateForm = document.getElementById("update-user-form");
    updateForm.style.display = "none";
  }

  async function displayUsers() {
    const usersList = document.getElementById("users-list");
    usersList.innerHTML = "";
  
    const users = await User.getAll();
  
    users.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.id = `user-list-item-${user.id}`;
      listItem.style = "margin-top: 1rem; margin-bottom: 1rem;";
      listItem.textContent = `Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`;
  
      const editButton = document.createElement("button");
      editButton.style = "margin-right: 1rem; margin-left: 1rem;";
      editButton.textContent = "Edit";
      editButton.onclick = () => {
        // Afficher le formulaire d'édition avec les données de la commande sélectionnée
        showUpdateForm(user.username, user.email, user.role);
      };
      listItem.appendChild(editButton);
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.onclick = async () => {
        const userToDelete = await User.getById(user.id);
        const deleted = await userToDelete.delete();
        if (deleted) {
          displayUsers();
          showAlert("User supprimée!");
        } else
          showAlert(
            "Une erreur s'est produite lors de la suppression de l'user.",
          );
      };
      listItem.appendChild(deleteButton);
  
      usersList.appendChild(listItem);
    });
  }