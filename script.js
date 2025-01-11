const API_URL =
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

// Fetch cart data from the JSON API
async function fetchCartData() {
  try {
    const response = await fetch(API_URL); // Replace with the actual API URL
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }

    const cartData = await response.json(); // Parse JSON response
    populateCart(cartData); // Populate the cart with fetched data
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Function to populate the cart dynamically
function populateCart(data) {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = ""; // Clear existing items

  // Loop through items and render them
  data.items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <span class="cart-title">${item.title}</span>
        </td>
        <td>₹${(item.price / 100).toFixed(2)}</td>
        <td>
          <input type="number" value="${
            item.quantity
          }" min="1" class="quantity-input" data-id="${item.id}">
        </td>
        <td class="item-subtotal">₹${(item.line_price / 100).toFixed(2)}</td>
        <td>
          <button class="remove-btn" data-id="${item.id}">🗑️</button>
        </td>
      `;
    cartList.appendChild(row);
  });

  attachEventListeners(data); // Attach events
  calculateTotals(data); // Calculate totals
}

// Function to calculate subtotal and total
function calculateTotals(data) {
  const subtotal = data.items.reduce((sum, item) => sum + item.line_price, 0);
  document.getElementById("subtotal").textContent = `₹${(
    subtotal / 100
  ).toFixed(2)}`;
  document.getElementById("total").textContent = `₹${(subtotal / 100).toFixed(
    2
  )}`;
}

// Function to attach event listeners for quantity change and removal
function attachEventListeners(data) {
  const quantityInputs = document.querySelectorAll(".quantity-input");
  const removeButtons = document.querySelectorAll(".remove-btn");

  // Quantity change
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const newQuantity = parseInt(event.target.value);
      const itemId = event.target.dataset.id;
      updateQuantity(data, itemId, newQuantity);
    });
  });

  // Remove item
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.dataset.id;
      removeItem(data, itemId);
    });
  });
}

// Function to update the quantity of an item
function updateQuantity(data, itemId, newQuantity) {
  if (newQuantity < 1) {
    alert("Quantity must be at least 1");
    return;
  }

  const item = data.items.find((item) => item.id == itemId);
  if (item) {
    item.quantity = newQuantity;
    item.line_price = item.price * newQuantity;
  }

  populateCart(data); // Re-render cart
}

// Function to remove an item
function removeItem(data, itemId) {
  data.items = data.items.filter((item) => item.id != itemId);
  populateCart(data); // Re-render cart
}

// Fetch cart data and initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchCartData();
});
