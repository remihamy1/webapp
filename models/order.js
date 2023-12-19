class Order {
  id;
  userId;
  date;
  total;

  constructor(userId, date, total) {
    this.userId = userId;
    this.date = date;
    this.total = total;
  }

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

  static async getAll() {
    try {
      const response = await fetch(`${baseUrl}/orders`);
      if (!response.ok) {
        throw new Error("Unable to fetch orders");
      }
      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve order");
      }
      const order = await response.json();
      console.log(order)
      return order
    } catch (error) {
      console.error("Error getting order:", error.message);
      return null;
    }
  }

  async save() {
    try {
      const lastOrderId = await Order.#getLastOrderId();
      this.id = lastOrderId + 1;

      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this),
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      const createdOrder = await response.json();
      return createdOrder;
    } catch (error) {
      console.error("Error creating order:", error.message);
      return null;
    }
  }

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

  async update(updatedOrder) {
    try {
      const response = await fetch(`${baseUrl}/orders/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      const updated = await response.json();
      return updated;
    } catch (error) {
      console.error("Error updating order:", error.message);
      return null;
    }
  }
}
