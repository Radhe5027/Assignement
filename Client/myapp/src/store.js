import { writable, get } from "svelte/store";
import { jwtDecode } from "jwt-decode";

// Define stores
export const page = writable(1);
export const limit = writable(10);
export const totalPages = writable(1);
export const displayedData = writable([]);
export const password = writable("");
export const userRole = writable("");
export const selectedSubcategoryId = writable(null); // Track selected subcategory
export const products = writable([]); // Store fetched products
export const filteredProducts = writable([]);
export const selectedCategoryId = writable(null); // Store selected category ID
export const cartStore = writable([]);
export const isAuthenticated = writable([false]);
export const productDetails = writable([null]);
export const cartItems = writable([]); // store to hold cart items
export const totalPrice = writable(0); // Store to hold the total price
export const isAdmin = writable(false);
export const newProduct = writable({
  name: "",
  description: "",
  price: "",
  categoryId: null,
  newCategoryName: "",
  newCategorySlug: "",
  url_slug: "",
  stock_quantity: "",
  image_url: "",
  variants: [],
});

// Password validation function
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasDigit) {
    return "Password must contain at least one digit.";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character.";
  }

  return ""; // Return an empty string if the password is valid
};

// Function to extract role from JWT token and store it
export const setRoleFromToken = () => {
  const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from local storage
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decode the token
      console.log("Decoded token:", decodedToken); // Log entire token payload

      // Extract the role from the decoded token
      const role = decodedToken.role_id || ""; // Fallback to empty string if role doesn't exist

      // Set role in store
      userRole.set(role);
      console.log("User role:", role); // Log role
    } catch (error) {
      console.error("Error decoding token:", error);
      userRole.set(""); // Clear role on error
      isAdmin.set(false);
    }
  } else {
    userRole.set(""); // Clear role if no token
    isAdmin.set(false);
  }
};

// Fetch products from the backend and store them
export const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    products.set(data); // Set the full list of products
    filteredProducts.set(data); // Initially, filteredProducts is the same as the full list
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// function to add a product with admin acesses

export const addProduct = async (newProduct) => {
  let adminStatus;
  isAdmin.subscribe((value) => (adminStatus = value));

  if (!adminStatus) {
    alert("You must be an admin to add a product.");
  }

  const token = localStorage.getItem("jwtToken"); // Retrieve token from local storage
  if (!token) {
    alert("Authorization token missing. Please log in again.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        newCategoryName: newProduct.newCategoryName,
        newCategorySlug: newProduct.newCategorySlug,
        url_slug:
          newProduct.url_slug ||
          newProduct.name.replace(/\s+/g, "-").toLowerCase(),
        stock_quantity: parseInt(newProduct.stock_quantity),
        image_url: newProduct.image_url,
        variants: newProduct.variants.map((variant) => ({
          color: variant.color,
          size: variant.size,
          price: parseFloat(variant.price),
          stock_quantity: parseFloat(variant.stock_quantity),
          image_url: variant.image_url,
        })),
      }),
    });

    if (response.ok) {
      alert("Product added successfully");
      fetchProducts(); // Refresh product list after adding new product
    } else {
      alert("Failed to add product");
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Function to delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      // If product is deleted successfully, remove it from the store
      products.update((productList) =>
        productList.filter((product) => product.id !== id)
      );
      alert("Product deleted successfully");
    } else {
      const error = await response.json();
      alert(error.message || "Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product");
  }
};

// Fetch product details based on each product ID
export const fetchProductDetails = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Parse JSON response
    productDetails.set(data); // Set the fetched product details to the store
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

// Filter products based on the selected subcategory
export const filterProducts = (subcategoryId) => {
  selectedSubcategoryId.set(subcategoryId);
  products.update((allProducts) => {
    const filtered = allProducts.filter(
      (product) => product.cat_id === subcategoryId
    );
    filteredProducts.set(filtered); // Set filtered products in the store
    return allProducts;
  });
};

// Function to calculate total price
export const calculateTotalPrice = (cartItems) => {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity; // Assuming each item has price and quantity
  });
  return total;
};

export async function fetchCartItems(cartItems) {
  const token = localStorage.getItem("jwtToken"); // Get the token from local storage

  if (!token) {
    console.error("No token found, user is not authenticated");
    alert("You need to log in first.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token as Authorization header
      },
    });

    // Check if the response is okay (status 200)
    if (response.ok) {
      const data = await response.json();

      // Ensure the cart data structure is valid and items exist
      if (Array.isArray(data) && data.length > 0) {
        cartItems.set(data); // Update the store with the cart items
        calculateTotalPrice(data); // Calculate total price for the cart
      } else {
        cartItems.set([]); // Set an empty array if cart is empty
        alert("Your cart is empty.");
      }
    } else if (response.status === 401) {
      console.error("Unauthorized: Token is missing or invalid");
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // Redirect to login page if session expired
    } else {
      console.error("Failed to load cart items:", response.statusText);
      alert("Failed to load cart items.");
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
    alert("An error occurred while fetching cart items.");
  }
}

// Function to update cart item quantity
export const updateCartQuantity = async (
  cartItemId,
  productId,
  variantId,
  newQuantity
) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(
      `http://localhost:3000/api/cart/${cartItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          product_variant_id: variantId || null,
          quantity: newQuantity,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      cartStore.update((items) => {
        const updatedItems = items.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );

        calculateTotalPrice(updatedItems);
        return updatedItems;
      });
      alert("Cart item updated successfully!");
    } else {
      alert(data.error || "Failed to update cart item.");
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    alert("Failed to update cart item.");
  }
};

// Function to decrease cart quantity
export const decreaseCartQuantity = async (
  cartItemId,
  productId,
  variantId,
  currentQuantity
) => {
  if (currentQuantity <= 1) {
    alert("Quantity cannot be less than 1.");
    return;
  }

  const newQuantity = currentQuantity - 1;
  await updateCartQuantity(cartItemId, productId, variantId, newQuantity); // Reuse the update function
};

const API_BASE_URL = "http://localhost:3000/api/addresses";

export async function createShippingAddress(data) {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("User not authenticated. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to create address");
    }

    // Return the newly created address
    return await response.json();
  } catch (error) {
    console.error("Error creating shipping address:", error.message);
    throw error; // Re-throw error to be handled by the calling function
  }
}

// Get all shipping addresses for a specific user
// Store.js or wherever your API calls are defined
export const getShippingAddresses = async () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("jwtToken");
  console.log("Retrieved Token:", token); // Debugging line

  // If no token is found, throw an error indicating the user isn't logged in
  if (!token) {
    throw new Error("User is not logged in");
  }

  // Create the fetch options
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all shipping addresses
  const response = await fetch(
    `http://localhost:3000/api/addresses`,
    fetchOptions
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipping addresses");
  }

  return await response.json(); // Return the parsed JSON response
};

// Update a shipping address
export async function updateShippingAddress(id, data) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// Delete a shipping address
export async function deleteShippingAddress(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}
