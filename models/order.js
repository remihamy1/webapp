class Order {
  id;
  userId;
  date;
  total;

  constructor(userId, date, total) {
    this.userId = parseInt(userId);
    this.date = date;
    this.total = total;
  }

  /**
   *
   * @returns {number}
   */
  static async #getLastOrderId() {
    try {
      const response = await fetch(`${baseUrl}/orders`);
      if (!response.ok) {
        throw new Error("Unable to fetch orders");
      }
      const orders = await response.json();
      const lastOrder = orders[orders.length - 1];
      return lastOrder ? lastOrder.id : 0; // If no orders exist, start ID from 0
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      return 0;
    }
  }

  /**
   *
   * @returns {Order[]}
   */
  static async getAll() {
    try {
      const response = await fetch(`${baseUrl}/orders`);
      if (!response.ok) {
        throw new Error("Unable to fetch orders");
      }

      const ordersData = await response.json();
      if (Array.isArray(ordersData)) {
        const orders = ordersData.map((orderData) => {
          const order = new Order(); // Crée une instance vide de Order

          // Parcours des propriétés de l'objet JSON et les assigner à l'instance de Order
          Object.assign(order, orderData)

          return order;
        });

        return orders;
      } else {
        throw new Error("Orders data is invalid");
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }
  }

  /**
   *
   * @param {number} id
   * @returns {Order}
   */
  static async getById(id) {
    try {
      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve order");
      }

      const orderData = await response.json();
      if (orderData) {
        const order = new Order(); // Crée une instance vide de Order

        // Assigner les propriétés de orderData à l'instance de Order
        Object.assign(order, orderData);

        return order;
      } else {
        throw new Error("Order data is invalid");
      }
    } catch (error) {
      console.error("Error getting order:", error.message);
      return null;
    }
  }

  /**
   *
   * @returns {Order}
   */
  async save() {
    try {
      const lastOrderId = await Order.#getLastOrderId();
      this.id = lastOrderId + 1;

      // Création d'un objet contenant uniquement les propriétés de l'instance actuelle (this)
      const body = {};
      Object.assign(body, this);

      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await response.json();
      if (createdOrder) {
        const order = new Order(); // Crée une instance vide de Order

        // Assigner les propriétés de createdOrder à l'instance de Order
        Object.assign(order, createdOrder);

        return order;
      } else {
        throw new Error("Order data is invalid");
      }
    } catch (error) {
      console.error("Error creating order:", error.message);
      return null;
    }
  }

  /**
   *
   * @returns {boolean}
   */
  async delete() {
    try {
      const response = await fetch(`${baseUrl}/orders/${this.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      return true;
    } catch (error) {
      console.error("Error deleting order:", error.message);
      return false;
    }
  }

  /**
   *
   * @returns {Order}
   */
  async update() {
    try {
      const body = {};
      Object.assign(body, this);

      const response = await fetch(`${baseUrl}/orders/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      const updated = await response.json();
      if (updated) {
        const order = new Order(); // Crée une instance vide de Order

        // Assigner les propriétés de updated à l'instance de Order
        Object.assign(order, updated);

        return order;
      } else {
        throw new Error("Order data is invalid");
      }
    } catch (error) {
      console.error("Error updating order:", error.message);
      return null;
    }
  }
}

async function createOrder() {
  const userId = document.getElementById("order-user-id").value;
  const date = new Date(document.getElementById("order-date").value);
  const total = document.getElementById("order-total").value;

  const formattedDate = date.toLocaleDateString("fr-FR"); // Format 'dd/MM/yyyy'

  const newOrder = new Order(userId, formattedDate, total);

  const createdOrder = await newOrder.save();

  if (createdOrder) {
    showAlert("Commande créée avec succès!");

    // Actualiser la liste des commandes après en avoir créé une nouvelle
    displayOrders();
  }
}

// Modifie la visibilité du formulaire d'édition et pré-remplit les champs avec les données de la commande sélectionnée
function showUpdateForm(orderId, userId, date, total) {
  document.getElementById("edit-order-id").value = orderId;
  document.getElementById("edit-order-user-id").value = userId;
  document.getElementById("edit-order-total").value = total;

  // Convertir la date au format 'dd/MM/yyyy' en un objet Date JavaScript
  const [day, month, year] = date.split("/");
  const formattedDate = new Date(`${year}-${month}-${day}`);

  // Vérifier si la date est valide avant de l'assigner au champ de date du formulaire
  if (!isNaN(formattedDate.getTime())) {
    document.getElementById("edit-order-date").valueAsDate = formattedDate;
  } else {
    // En cas d'erreur de conversion, assigner une chaîne vide
    document.getElementById("edit-order-date").value = "";
  }

  const updateForm = document.getElementById("update-order-form");
  updateForm.style.display = "block";
}

async function updateOrder() {
  const orderId = document.getElementById("edit-order-id").value;
  const userId = document.getElementById("edit-order-user-id").value;
  const date = new Date(document.getElementById("edit-order-date").value);
  const total = document.getElementById("edit-order-total").value;

  const formattedDate = date.toLocaleDateString("fr-FR"); // Format 'dd/MM/yyyy'

  const order = await Order.getById(orderId);
  order.userId = userId;
  order.date = formattedDate;
  order.total = total;

  console.log(order);
  const updated = await order.update();

  if (updated) {
    showAlert("Commande mise à jour avec succès!");

    // Actualiser la liste des commandes après la mise à jour
    displayOrders();
  } else {
    showAlert("Erreur lors de la mise à jour de la commande.");
  }

  // Masquer le formulaire d'édition après la mise à jour
  const updateForm = document.getElementById("update-order-form");
  updateForm.style.display = "none";
}

// Fonction pour afficher toutes les commandes existantes
async function displayOrders() {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = "";

  const orders = await Order.getAll();

  orders.forEach((order) => {
    const listItem = document.createElement("li");
    listItem.id = `order-list-item-${order.id}`;
    listItem.style = "margin-top: 1rem; margin-bottom: 1rem;";
    listItem.textContent = `ID: ${order.id}, UserID: ${order.userId}, Date: ${order.date}, Total: ${order.total}`;

    const editButton = document.createElement("button");
    editButton.style = "margin-right: 1rem; margin-left: 1rem;";
    editButton.textContent = "Edit";
    editButton.onclick = () => {
      // Afficher le formulaire d'édition avec les données de la commande sélectionnée
      showUpdateForm(order.id, order.userId, order.date, order.total);
    };
    listItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.onclick = async () => {
      const orderToDelete = await Order.getById(order.id);
      const deleted = await orderToDelete.delete();
      if (deleted) {
        displayOrders();
        showAlert("Commande supprimée!");
      } else
        showAlert(
          "Une erreur s'est produite lors de la suppression de la commande.",
        );
    };
    listItem.appendChild(deleteButton);

    ordersList.appendChild(listItem);
  });
}
