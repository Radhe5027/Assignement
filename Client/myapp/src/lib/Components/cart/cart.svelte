<script>
    import { onMount } from 'svelte';
    import {get, writable} from 'svelte/store';
    import { cartStore,cartItems,totalPrice,fetchCartItems, updateCartQuantity,decreaseCartQuantity} from '../../../store';
    import { navigate } from 'svelte-routing';
    import ShippingadressForm from './shippingadressForm.svelte';
    import Headerfooter from '../header/headerfooter.svelte';


    let items = [];
    let price = 0;
    let selectedAddress = null;

    // let cartItems;
    // $:totalstorePrice = totalPrice();
    let token = localStorage.getItem('jwtToken');



    // Fetch the cart items when the component mounts
  onMount(async () => {
    await fetchCartItems(cartStore);
  });



  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => {
        // Ensure both price and quantity are valid numbers
        const itemPrice = Number(item.Product?.price) || 0;  // Default to 0 if undefined or invalid
        const itemQuantity = Number(item.quantity) || 0;    // Default to 0 if undefined or invalid
        return total + (itemPrice * itemQuantity);
    }, 0);
};


  



    // Subscribe to cart store to get the latest cart items
  cartStore.subscribe(updatedItems => {
    items = updatedItems;
    price = calculateTotalPrice(updatedItems);
  });



  


    // totalPrice.subscribe(price => {
    //     totalstorePrice = price; // Update the total price when it changes
    // });








//     // Function to calculate total price
//     const calculateTotalPrice = (items) => {
//     console.log("Items in cart:", items);  // Inspect the structure

//     totalPrice = items.reduce((sum, item) => {
//         const price = item.Product?.price || 0;  // Use optional chaining and default to 0 if undefined
//         return sum + price * (item.quantity || 1);
//     }, 0);
// };


    // // Subscribe to the cart and totalPrice store
    // cartStore.subscribe(items => {
    //     cartItems = items;
    // });


    // totalPrice.subscribe(price => {
    //     totalstorePrice = price;
    // });



//     onMount(async () => {
//     const token = localStorage.getItem('jwtToken');
//     console.log('Token in onMount:', token); // Debugging log

//     if (!token) {
//         console.log('Token not found. Redirecting to login.');
//         alert('Please log in to view your cart.');
//         navigate('/login');
//         return;
//     }

//     try {
//         console.log('Authorization header:', `Bearer ${token}`); // Debugging log
//         const response = await fetch('http://localhost:3000/api/cart', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Ensure token is included
//             },
//         });

//         console.log('Response from cart API:', response); // Debugging log

//         if (response.ok) {
//             const data = await response.json();
//             cartStore.set(data); // Set cart items in the store
//             cartItems = data;
//             calculateTotalPrice(cartItems);
//         } else {
//             const error = await response.json();
//             alert(error.error || ' You have been logged out due to inactivity. Kindly login again');
//             window.location.href = '/login';
//         }
//     } catch (error) {
//         console.error('Error fetching cart items:', error);
//         alert('Failed to fetch cart items.');
//     }
// });


    // // Subscribe to cart store updates
    // cartStore.subscribe((items) => {
    //     cartItems = items;
    //     calculateTotalPrice(cartItems);
    // });

    

   

//     // Function to update cart item quantity
//     const updateCartQuantity = async (cartItemId,productId, variantId, newQuantity) => {
//     const token = localStorage.getItem('jwtToken');

//     try {
//         const response = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
//             method: 'PUT', // or 'PATCH'
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ 
//                 productId: productId, 
//                 product_variant_id: variantId || null, // Handle variant ID if exists
//                 quantity: newQuantity 
//             }), // Ensure quantity is sent here
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             alert(data.error || 'Failed to update cart item.');
//         } else {
//             alert('Cart item updated successfully!');
//         }
//     } catch (error) {
//         console.error('Error updating cart item:', error);
//         alert('Failed to update cart item.');
//     }
// };


const handleQuantityUpdate = (cartItem, operation) => {
    const newQuantity = operation === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;

    // Ensure the quantity is greater than 0
    if (newQuantity > 0) {
        updateCartQuantity(cartItem.id, cartItem.productId, cartItem.variantId, newQuantity);
    } else {
        alert('Quantity must be greater than 0');
    }
};




// Handle decreasing item quantity
const handleDecreaseQuantity = (cartItem) => {
        const newQuantity = cartItem.quantity - 1;
        if (newQuantity < 1) {
            alert('Quantity cannot be less than 1.');
            return;
        }
        decreaseCartQuantity(cartItem.id, cartItem.productId, cartItem.variantId, newQuantity);
    };

// const decreaseCartQuantity = async (productId, variantId, currentQuantity, cartItemId) => {
//     const token = localStorage.getItem('jwtToken');

//     if (currentQuantity <= 1) {
//         alert("Quantity cannot be less than 1.");
//         return;
//     }

//     try {
//         const newQuantity = currentQuantity - 1; // Decrease quantity by 1

//         const response = await fetch(`http://localhost:3000/api/cart/${cartItemId}`, {
//             method: 'PUT', // or 'PATCH'
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify({ 
//                 productId: productId, 
//                 product_variant_id: variantId || null, // Handle variant ID if exists
//                 quantity: newQuantity // Send the new quantity
//             }), // Ensure quantity is sent here
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             alert(data.error || 'Failed to update cart item.');
//         } else {
//             alert('Cart item updated successfully!');
//         }
//     } catch (error) {
//         console.error('Error updating cart item:', error);
//         alert('Failed to update cart item.');
//     }
// };



const removeFromCart = async (productId, product_variant_id) => {
    console.log('Attempting to remove item with Product ID:', productId, 'and Variant:', product_variant_id || 'N/A');

    // Log the current cart items and to check the structure and ID
    const currentCartItems = get(cartStore);
    console.log('Current cart items:', currentCartItems);

    try {
        // Construct URL and add product_id, and optionally product_variant_id if defined
        const url = new URL('http://localhost:3000/api/cart');
        url.searchParams.append('product_id', productId);
        if (product_variant_id !== undefined && product_variant_id !== null) {
            url.searchParams.append('product_variant_id', product_variant_id);
        }

        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            // Update the cart store and remove the item based on product and optional variant ID
            cartStore.update(items => 
                items.filter(item => 
                    item.product_id !== productId || (product_variant_id && item.product_variant_id !== product_variant_id)
                )
            );
            alert('Item removed from cart successfully');
        } else if (response.status === 404) {
            console.error('Cart item not found for deletion');
            alert('The item you are trying to delete does not exist in the cart.');
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to remove cart item.');
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
        alert('Failed to remove cart item.');
    }
};



    // // Function to navigate back to products
    // const goBackToProducts = () => {
    //     navigate('/');
    // };


// Helper function to extract user ID from JWT token
const getUserIdFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; // Assuming your JWT payload contains userId
    } catch (err) {
        console.error('Error parsing JWT token:', err);
        return null;
    }
};







// Handle address selection from ShippingAddressForm
function handleAddressSelection(selectedAddr) {
    selectedAddress = selectedAddr;
    console.log('Selected Address:', selectedAddress);
}

const handlePlaceOrder = async () => {
    // Get the selected address from localStorage or session
    const selectedAddress = localStorage.getItem('selectedAddress');
    if (!selectedAddress) {
        alert("Please select an address before placing the order.");
        return;
    }

    // Calculate total amount, discount, and other required fields
    let totalAmount = 0;
    let discountAmount = 0;
    let grossAmount = 0;
    let netAmount = 0;
    const shippingAmount = 50;  // Example shipping cost, can be dynamic if needed

    // Iterate over cart items and calculate totals
    items.forEach(item => {
        const productPrice = item.ProductVariant.price;  // Assuming `ProductVariant` contains price
        const quantity = item.quantity;
        totalAmount += productPrice * quantity;
        // Placeholder: Add discount logic if applicable
        discountAmount += 0;  // Example, you can replace this with real discount logic
    });

    // Calculate gross amount (totalAmount + shipping)
    grossAmount = totalAmount + shippingAmount;
    // Calculate net amount (gross amount + discountAmount)
    netAmount = grossAmount - discountAmount;

    // Prepare payload with necessary information
    const payload = {
        user_id: getUserIdFromToken(token),  // Get user ID from token
        total_amount: totalAmount,
        discount_amount: discountAmount,
        gross_amount: grossAmount,
        shipping_amount: shippingAmount,
        net_amount: netAmount,
        payment_type: 'cod',  // Can be dynamic based on user selection, e.g. 'credit_card', 'paypal', etc.
        payment_transaction_id: null,  // Add if you have a payment gateway ID
        cart_items: items.map(item => ({
            product_id: item.product_id,  // Assuming `product_id` is part of the item
            product_variant_id: item.product_variant_id,  // Same here
            quantity: item.quantity
        })),
    };

    try {
        // Send POST request to place the order
        const response = await fetch('http://localhost:3000/api/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,  // Include token for authorization
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        const data = await response.json();
        alert(data.message);  // Display the success message from the API

        // Redirect user to the order confirmation page
        navigate('/order-confirmation');  // Use react-router for navigation
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    }
};





    
</script>



<style>

    

    .cart-container {
        padding: 20px;
        max-width: 800px;
        margin: auto;
        color: rgb(0, 0, 0);
        background-color: rgb(242, 241, 241);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1f1414;
        padding: 10px 0;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .item-image {
        margin-right: 20px;
    }
    
    .item-image img {
        width: 150px; /* Adjust size as needed */
        height: 150px;
        border-radius: 8px;
    }
    
    .item-details {
        flex: 1;
    }
    
    .item-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .item-actions button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .increase-button {
        background-color: #28a745;
    }
    
    .increase-button:hover {
        background-color: #218838;
    }
    
    .decrease-button {
        background-color: #ffc107;
        color: black;
    }
    
    .decrease-button:hover {
        background-color: #e0a800;
    }
    
    .remove-button {
        background-color: #dc3545;
    }
    
    .remove-button:hover {
        background-color: #c82333;
    }
    
    .cart-total {
        text-align: left;
        font-size: 1.5rem;
        margin-top: 20px;
        font-weight: lighter;
    }
    
    .back-button {
        margin-top: 20px;
        padding: 10px 15px;
        background-color: #ff0090;
        color: #f5f5f5;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .back-button:hover {
        background-color: #0056b3;
    }

    .checkout-button {
        background-color: #ff0090;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 15px;
        cursor: pointer;
        text-align: right;
    }

    .cart-actions {
        display: flex; /* Use flexbox for alignment */
        justify-content: space-evenly; /* Space between buttons */
        margin-top: 20px; /* Add margin if needed */
    }


</style>

<Headerfooter />

<ShippingadressForm on:click handleAddressSelection = {handleAddressSelection} />

<div class="cart-container">
    <h2></h2>

    {#if items.length > 0}
        {#each items as item}
            <div class="cart-item">
                <div class="item-image">
                    <!-- Check if ProductVariant and image_url exist before rendering the image -->
                    {#if item.ProductVariant && item.ProductVariant.image_url}
                        <img src={item.ProductVariant.image_url} alt={item.Product.product_name} />
                    {:else}
                        <!-- Render a placeholder image if ProductVariant or image_url is missing -->
                        <img src="/path/to/default-image.jpg" alt="No image available" />
                    {/if}
            
                </div>

                <div class="item-details">
                    <!-- Check if the product variant exists before rendering its details -->
                    {#if item.ProductVariant}
                        <h3>{item.Product.product_name} - {item.ProductVariant.color}</h3>
                    {:else}
                        <h3>{item.Product.product_name}</h3>
                    {/if}
                    <p>Price: &#8377<span>{item.Product.price.toFixed(2)}</span></p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total for this item: &#8377<span>{(item.Product.price * item.quantity).toFixed(2)}</span></p>
                </div>
                <div class="item-actions">
                    <button class="increase-button" on:click={() => handleQuantityUpdate(item,'increase')}>+</button>

                    <button class="decrease-button" on:click={() => handleDecreaseQuantity(item)}>-</button>


                    <button class="remove-button" on:click={() => removeFromCart(item.product_id,item.product_variant_id)}>Remove From Cart</button>
                </div>
            </div>
        {/each}

        <div class="cart-total">
            
            <h3>Total Amount: &#8377<span>{price.toFixed(2)}</span></h3>
        </div>

        

        <div class="cart-actions">
            <button class="checkout-button" on:click={handlePlaceOrder}>Place Order</button>
            
            
        </div>
    {:else}
        <p>Your cart is empty.</p>
        
    {/if}
</div> 








