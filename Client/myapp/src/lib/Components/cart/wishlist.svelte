<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Headerfooter from '../header/headerfooter.svelte';
  
    let wishlist = [];
    let productId; // Product ID to be added to the wishlist
    let productVariantId; // Variant ID to be added to the wishlist
    let successMessage = '';
    let errorMessage = '';
  
    // Fetch wishlist when the component is mounted
    onMount(async () => {
      await fetchWishlist();
    });

    // Function to check if the user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('jwtToken');
    return token && token !== ''; // Check if token exists and is not empty
  };
  
    // Add item to wishlist
    async function addToWishlist() {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch('http://localhost:3000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            productVariantId,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          successMessage = data.message;
          await fetchWishlist(); // Refresh wishlist after adding
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add to wishlist');
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Error adding to wishlist:', error);
      }
    }
  
    // Fetch user's wishlist
    async function fetchWishlist() {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch('http://localhost:3000/api/wishlist', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          wishlist = data.wishlist;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch wishlist');
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Error fetching wishlist:', error);
      }
    }
  
    // Remove item from wishlist
    async function removeFromWishlist(wishlistItemId) {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`http://localhost:3000/api/wishlist/${wishlistItemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          wishlist = wishlist.filter((item) => item.id !== wishlistItemId);
          successMessage = 'Item removed from wishlist successfully.';
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove from wishlist');
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Error removing from wishlist:', error);
      }
    }

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

            if (response.ok && data.cartItem) {
                alert(data.message || 'Product added to cart'); // Show success message
                navigate('/cart'); // Navigate to cart page
            } else {
                alert(data.error || 'Failed to add to cart '); // Show error message
            }
        } catch (error) {
            console.error('Error adding to cart:', error); // Log error for debugging
            alert('Failed to add to cart.'); // Show generic error message
        }
    };
</script>

<Headerfooter/>
<style>
    * {
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        color: #333;
    }

    .wishlist-container {
        max-width: 1200px;  /* Match the product details max width */
        margin: 40px auto;
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 10px;
        border: 1px solid #151515;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .wishlist-container h2 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .product-item {
        display: flex;
        gap: 30px;
        margin-bottom: 20px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .product-item img {
        width: 100px; /* Adjust size for consistency */
        height: 100px;
        border-radius: 8px;
        object-fit: cover;
    }

    .product-item div {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .product-item p {
        font-size: 16px;
        color: #555;
        margin: 0;
    }

    .product-item button {
        padding: 8px 20px;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .product-item button:hover {
        background-color: #007bff;
    }

    .product-item button img {
        width: 20px;
        height: 20px;
    }

    .button-container {
        display: flex;
        gap: 20px;
        margin-top: 20px;
        justify-content: center;
    }

    .add-to-cart {
        background-color: #007bff;
        padding: 10px 50px;
        font-size: 16px;
        font-weight: bold;
        width: 200px;
    }

    .add-to-cart:hover {
        background-color: #00458f;
    }

    .remove-button {
        background-color: #e74c3c;
        padding: 10px 50px;
        font-size: 16px;
        font-weight: bold;
        width: 200px;
    }

    .remove-button:hover {
        background-color: #c4200e;
    }

    .error {
        color: red;
        margin-top: 10px;
    }

</style>

<div class="wishlist-container">
    <!-- Display Wishlist -->
    <h2>Your Wishlist</h2>
    <ul>
        {#if wishlist.length > 0}
            {#each wishlist as item}
                <li class="product-item">
                    <img src={item.ProductVariant?.image_url} alt={item.Product?.product_name || 'Product'} />
                    <div>
                        <p><strong>{item.Product?.product_name || 'Unknown Product'}</strong></p>
                        <p>Color: {item.ProductVariant?.color || 'N/A'}</p>
                    </div>
                    <div class="button-container">
                        <button class="add-to-cart" on:click={() => addToCart(item.Product.id, item.ProductVariant.id)}>
                            Add to Cart
                        </button>
                        <button class="remove-button" on:click={() => removeFromWishlist(item.id)}>
                            Remove
                        </button>
                    </div>
                </li>
            {/each}
        {:else if errorMessage}
            <p class="error">{errorMessage}</p>
        {:else}
            <p>Your wishlist is empty.</p>
        {/if}
    </ul>
</div>

