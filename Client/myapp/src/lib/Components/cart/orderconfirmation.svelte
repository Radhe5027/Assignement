<script>
    import { navigate } from 'svelte-routing';
    import { cartStore } from '../../../store'; // Make sure to import the cart store
    import { writable } from 'svelte/store';
    import { jwtDecode } from 'jwt-decode';
    import Headerfooter from '../header/headerfooter.svelte';
    import Checkout from './checkout.svelte';

    let cartItems = [];
    let userName = "";
    let selectedAddress = "";

    // Fetch the cart items and user info when the component is mounted
    import { onMount } from 'svelte';
    
    onMount(() => {
        // Assuming you have cart items stored in cartStore
        cartStore.subscribe(items => {
            cartItems = items;
        });

        // Decode the JWT token to get user information
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decode the token
                userName = decodedToken.full_name || 'User'; // Get the full_name from the token
            } catch (error) {
                console.error('Error decoding token:', error);
                userName = 'User'; // Fallback in case of error
            }
        } else {
            userName = 'User'; // If no token found, fallback to 'User'
        }

        // Retrieve the selected address from localStorage with a slight delay
        setTimeout(() => {
            selectedAddress = localStorage.getItem('selectedAddress') || 'Please select an address';
            console.log('Retrieved Address:', selectedAddress); // Log for confirmation
        }, 100); // Delay of 100ms to ensure data is retrieved correctly
    });

    // Navigate to checkout page
    const goToCheckout = () => {
        navigate('/orders');
    };


</script>

<style>
    .confirmation-container {
        padding: 20px;
        max-width: 600px;
        margin: 60px auto 20px auto;
        text-align: center;
        color: #333;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
        color: #28a745;
    }

    .cart-items {
        list-style-type: none;
        padding: 0;
        margin-top: 20px;
    }

    .cart-item-image img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        margin-right: 20px;
    }

    .cart-item {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .cart-item:last-child {
        border-bottom: none;
    }

    .address-info {
        margin-top: 20px;
    }

    .user-name {
        font-size: 1.2rem;
        font-weight: bold;
    }

    .address {
        font-size: 1rem;
        color: #555;
    }
</style>

<Headerfooter />

<div class="confirmation-container">
    <h2>Order Placed Successfully!</h2>
    <p class="user-name">Thank you, {userName}!</p>
    <p>Your order has been successfully placed and is being processed.</p>

    <div class="cart-items">
        <h3>Your Cart Items:</h3>
        {#each cartItems as item}
        <div class="cart-item-image">
            <!-- Assuming item.Product.image_url contains the image URL -->
            <img src={item.ProductVariant.image_url} alt={item.ProductVariant.product_name} />
        </div>
        <div class="cart-item-details">
            <p><strong>{item.Product.product_name}</strong></p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: &#8377{item.Product.price}</p>
        </div>
        {/each}
    </div>

    <div class="address-info">
        <h3>Shipping Address:</h3>
        <p class="address">{selectedAddress}</p>
    </div>

    <!-- Button to navigate to Checkout page -->
    <button class="button" on:click={goToCheckout}>Proceed to Checkout</button>
</div>

