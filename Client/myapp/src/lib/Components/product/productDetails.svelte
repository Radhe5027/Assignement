<script>
    import { onMount } from 'svelte';
    import{navigate} from 'svelte-routing';
    import { fetchProductDetails, productDetails, cartStore, userRole } from '../../../store'; // Adjust the path to your store
    import { writable } from 'svelte/store';
    import Headerfooter from '../header/headerfooter.svelte';
    
    

    export let id; // Receive the product ID as a prop


    let product = null;
    let selectedVariant;
    let errorMessage = '';
    let isWishlisted = false;



    // Function to check if user is logged in or not
    function isUserLoggedIn() {
    return Boolean(localStorage.getItem('jwtToken'));
    }



    // Redirect to login if user is not logged in
onMount(async () => {
    if (!isUserLoggedIn()) {
        alert('Please log in to view product details.');
        navigate('/login');
        return;
    }




    await fetchProductDetails(id); // Fetch product details based on the provided ID
    productDetails.subscribe((data) => {
        product = data;
        if (!product) {
            errorMessage = 'Error fetching product details.';
        }
    });
});



    //Select product variant
    function selectVariant(variant){
        selectedVariant = variant;
    };






    // Function to add product to cart
const addToCart = async (productId, variantId, quantity = 1) => { // Default quantity set to 1

    if (!isUserLoggedIn()) {
        // User is not authenticated, redirect to login
        alert('Please log in to add items to your cart.');
        navigate('/login');
        return;
    }

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId: productId,
                product_variant_id: variantId || null, // Use variantId if provided, otherwise null
                quantity: quantity, // Use provided quantity or default
            }),
        });

        const data = await response.json();

        // console.log('Full Response:', response);
        // console.log('Response Status:', response.status);
        // console.log('Response OK:', response.ok);
        // console.log('Data:', data);


    
        if (response.ok && data.cartItem) {
            // Update the cart store

            const item = {
                ...data.cartItem,
                Product:{ price: data.cartItem.price || 0} // Make sure product exist
            };

            cartStore.update(cart => [...cart, item]); // Add the new cart item to the store
            alert(data.message || 'Product added to cart'); // Show success message
            navigate('/cart'); // Navigate to cart page
        } else {
            alert(data.error || 'Failed to add to cart '); // Show error message returned from server
        }
    } catch (error) {
        console.error('Error adding to cart:', error); // Log error for debugging
        alert('Failed to add to cart.'); // Show generic error message
    }
};



// Function to add product to wishlist
const addToWishlist = async (productId, productVariantId) => {
    // Check if the user is logged in
    if (!isUserLoggedIn()) {
        alert('Please log in to add items to your wishlist.');
        navigate('/login'); // Redirect to login page
        return;
    }

    try {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from local storage
        if (!token) {
            alert('Authorization token missing. Please log in again.');
            navigate('/login');
            return;
        }

        // API request to add item to wishlist
        const response = await fetch('http://localhost:3000/api/wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Attach token for authentication
            },
            body: JSON.stringify({
                productId, // Product ID (matches backend's key)
                product_variant_id: productVariantId || null, // Variant ID or null if not applicable
            }),
        });

        const data = await response.json(); // Parse response data

        if (response.ok) {
            alert(data.message || 'Product added to wishlist successfully.'); // Show success message
        } else {
            alert(data.error || 'Failed to add to wishlist.'); // Show error message from server
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error); // Log error for debugging
        alert('An unexpected error occurred. Please try again later.'); // Show generic error message
    }
};



// // Function to handle "Buy Now" action
// function buyNow() {
//         if (!isUserLoggedIn()) {
//             alert('Please log in to proceed with the purchase.');
//             navigate('/login');
//         } else {
//             addToCart(product.id, selectedVariant?.id); // Add to cart first
//             navigate('/checkout'); // Redirect to checkout
//         }
//     }

    // // Function to navigate to home
    // function goToHome() {
    //     navigate('/');
    // }


    // // Function to log out the user
    // function logout() {
    //     localStorage.removeItem('jwtToken'); // Remove the JWT token from local storage
    //     alert('You have been logged out successfully.');
    //     navigate('/login'); // Redirect to the login page
    // }


</script>

<Headerfooter/>


{#if product}
    <div class="product-details">
        <div class="image-section">
            <img class="product-image" src={selectedVariant ? selectedVariant.image_url : product.image_url} alt={product.product_name} />
        </div>
        
        <div class="info-section">
            <h2 class="product-name">{product.product_name}</h2>
            <p class="product-description">{product.description}</p>
            
            {#if product.variants && product.variants.length > 0}
                <h3 class="variants-title">MORE COLORS</h3>
                <div class="variant-selection">
                    {#each product.variants as variant}
                        <img 
                            src={variant.image_url} 
                            alt="{variant.color}" 
                            class="variant-thumbnail {selectedVariant === variant ? 'selected' : ''}"
                            on:click={() => selectVariant(variant)}
                        />
                    {/each}
                </div>
            {/if}

            <div class="button-container">
                <button 
                on:click={() => addToCart(product.id, selectedVariant ? selectedVariant.id : product.id)} 
                class="add-to-cart"
            >
                {#if selectedVariant} Add to Cart 
                {:else} Select One Color 
                
                {/if}
                </button>

                <button 
                    on:click={() => addToWishlist(product.id, selectedVariant ? selectedVariant.id : product.id)} 
                    class="add-to-cart"
                >
                    Add to Wishlist
                </button>
                
                
            </div>
        </div>
    </div>
{:else}
    <p class="loading">Loading product details...</p>
{/if}

<style>
    * {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    color: #333;
}

.product-details {
    display: flex;
    gap: 30px;
    margin: 20px;
    padding: 30px;
    border: 1px solid #151515;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    margin: 40px auto;
}

.image-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    width: 100%;
    max-width: 600px; /* Larger main image */
    border-radius: 8px;
    object-fit: cover;
}

.info-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.product-name {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
}

.product-description {
    font-size: 16px;
    color: #555;
}

.variants-title {
    font-size: 18px;
    font-weight: bold;
}

.variant-selection {
    display: flex;
    gap: 10px; /* Adjust gap between variants */
    margin-bottom: 20px;
}

.variant-thumbnail {
    width: 80px; /* Smaller size for variant images */
    height: 80px;
    margin-left: 150px;
    border-radius: 10%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.variant-thumbnail.selected {
    border-color: #007bff;
    transform: scale(1.1);
}

.button-container {
    display: flex;
    gap: 20px; /* Adjust spacing between buttons */
    margin-top: 20px;
    justify-content: center; /* Align buttons centrally */
}

.add-to-cart {
    padding: 10px 50px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 200px; /* Keep a fixed width for buttons */
}

.add-to-cart {
    background-color: #007bff;
}

.add-to-cart:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.add-to-cart:hover:not(:disabled) {
    background-color: #0056b3;
}

.loading {
    text-align: center;
    font-size: 18px;
    color: #666;
}

</style>
