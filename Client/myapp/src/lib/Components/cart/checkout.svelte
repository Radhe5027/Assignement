<script>
    import { onMount } from 'svelte';
    import {jwtDecode} from 'jwt-decode'; // Make sure to install jwt-decode: `npm install jwt-decode`
    import Headerfooter from '../header/headerfooter.svelte';
    
  
    let orders = [];
    let errorMessage = '';
  
    // Decode user ID from the token
    function getUserIdFromToken() {
      const token = localStorage.getItem('jwtToken'); // Assuming the token is stored in localStorage
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
      const decodedToken = jwtDecode(token); // Decode the token
      return decodedToken.id; // Adjust the key based on your JWT payload structure
    }
  
    // Fetch orders for the logged-in user
    async function getPlacedOrders(userId) {
      try {
        const token = localStorage.getItem('jwtToken');
        errorMessage = ''; // Clear any previous error messages
        userId = getUserIdFromToken(); // Get the user ID from the token
  
        const response = await fetch(`http://localhost:3000/api/getorders/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass token as Bearer token
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        orders = data.orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        orders = []; // Reset orders on error
        errorMessage = error.message || 'An error occurred.';
      }
    }



    // Delete order by ID
    async function deleteOrder(orderId) {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`http://localhost:3000/api/deleteplacedorder/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Remove the deleted order from the local list
          orders = orders.filter(order => order.id !== orderId);
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Error deleting order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        errorMessage = error.message || 'An error occurred while deleting the order.';
      }
    }
  
    // Fetch orders when the component is mounted
    onMount(() => {
      try {
        const userId = getUserIdFromToken(); // Get the user ID from the token
        getPlacedOrders(userId); // Fetch orders
      } catch (error) {
        console.error('Error:', error.message);
        errorMessage = error.message;
      }
    });
  </script>

  <Headerfooter/>
  
  <h2>Placed Orders</h2>
  
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
  
  {#if orders.length === 0 && !errorMessage}
    <p>No orders found.</p>
  {:else}
    <div id="orders-list">
        {#each orders as order}
        <div class="order-card">
          
          <!-- Display product details first -->
          <h4>Items:</h4>
          <ul>
            {#each order.OrderItems as item}
              <li class="product-item">
                <img src={item.ProductVariant.image_url} alt={item.ProductVariant.product_name} />
                <div class="product-details">
                  <p><strong>{item.Product.product_name}</strong></p>
                  <p>Color: {item.ProductVariant.color}</p>
                  <p>Price: &#8377;{item.price}</p>
                </div>
              </li>
            {/each}
          </ul>
  
          <!-- Display order details -->
          <div class="order-details">
            <h3>Tracking Id #{order.order_number}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
            <p><strong>Shipping Amount:</strong> &#8377;{order.shipping_amount}</p>
            <p><strong>Total Amount:</strong> &#8377;{order.net_amount}</p>


            <!-- Add delete button -->
            <button on:click={() => deleteOrder(order.id)} class="delete-button">
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/3606/3606795.png" 
                  alt="Delete Icon" 
                  class="delete-icon"
                />
                Delete Order
              </button>
          </div>
  
        </div>
      {/each}
    </div>
  {/if}
  
  <style>
    /* Styling for the title */
    h2 {
      margin-top: 100px;
      font-size: 24px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }

    h3 {
      font-size: 1px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }

    h4 {
      font-size: 1px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
    }

    .delete-button {
        display: flex;
        align-items: center;
        gap: 2px; /* Space between icon and text */
        background-color: #ff4d4f;
        color: white;
        border: none;
        border-radius: 5px;
        margin-left: 90px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    }

    .delete-button:hover {
        background-color: #e63946; /* Darker red on hover */
    }

    .delete-icon {
        width: 20px;
        height: 20px;
    }

  
    /* Styling for the error message */
    p {
      color: #333;
      font-size: 16px;
    }
  
    /* Orders list container */
    #orders-list {
      margin-top: 20px;
      padding: 10px;
      display: grid;
      gap: 20px;
      justify-items: center;
    }
  
    /* Styling for individual order cards */
    .order-card {
      border: 1px solid #ccc;
      margin: 10px 0;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      background-color: #fff;
    }
  
    .order-card h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }
  
    /* Styling for the order item images */
    .order-card img {
      max-width: 100px;
      border-radius: 5px;
      margin-right: 10px;
    }
  
    /* Styling for the list of items within an order */
    .order-card ul {
      list-style-type: none;
      padding: 0;
    }
  
    /* Styling for each item in the order list */
    .order-card ul li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 16px;
    }
  
    /* Styling for item details (name, price, color, size) */
    .order-card ul li p {
      margin-left: 10px;
    }
  
    /* Responsive Design for smaller screens */
    @media (max-width: 768px) {
      #orders-list {
        display: block;
        padding: 5px;
      }
  
      .order-card {
        width: 90%;
      }
  
      .order-card img {
        max-width: 80px;
      }
    }
  </style>