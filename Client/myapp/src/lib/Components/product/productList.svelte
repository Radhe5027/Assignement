<script>
    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import {get} from 'svelte/store';
    import CategoryList from "./categoryList.svelte";
    import { filteredProducts, fetchProducts, addProduct, deleteProduct,isAdmin } from '../../../store';
    import { userRole,cartStore, } from '../../../store'; // Assuming userRole is stored in a Svelte store
    import ProductDetails from "./productDetails.svelte";
    import Headerfooter from "../header/headerfooter.svelte";
    import Carousel from "../header/carousel.svelte";
    import Checkout from "../cart/checkout.svelte";
    
    
    export let searchTerm = '';
    export let isOpen = false;

    let products = [];
    let selectedSubcategoryId = null;
    let newProduct = {name: '', description: '', price: '', categoryId: null, newCategoryName: '', newCategorySlug: '', variants: [], url_slug: '', stock_quantity: '', image_url: ''};
    let newVariant = { color: '', size: '', price: '', stock_quantity: '', image_url: ''};
    let showVariantForm = true; 
    let sortedProducts = [...products];
    let selectedSort = 'Low to High';
    let showAddProductForm = false;
    
    
    




    // Fetch products when component mounts
    onMount(() => {
        fetchProducts();
    });

    


    onMount(() => {
        // Get the JWT token from localStorage (or use a store if you're storing the role)
        const token = localStorage.getItem('jwtToken');

        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token (if it's a valid JWT)
                if (decoded.role_id === 1) {
                    isAdmin.set(true);
                }else{
                    isAdmin.set(false);
                }

            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    });


    // Reactive statement to filter and sort products
    $: filteredAndSortedProducts = products
        .filter(product => product.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            return selectedSort === 'low-to-high' ? a.price - b.price : b.price - a.price;
        });

    // Subscribe to the filtered products store
    filteredProducts.subscribe((data) => {
        products = data;
    });

    // Function to handle adding the product along with variants
    async function handleAddProduct() {
        // Check if the user is an admin
        if (!$isAdmin) {
            alert('You must be an admin to add a product');
            return;
        }
        // Add the current variant to the product's variant list
        newProduct.variants.push({ ...newVariant });

        // Reset the variant fields for the next entry
        newVariant = { color: '', size: '', price: '', stock_quantity: '', image_url: '' };

        // Ask the admin if they want to add another variant
        const addAnother = confirm('Variant added! Do you want to add another variant?');

        // Show or hide the variant form based on the admin's response
        showVariantForm = addAnother;

        // If they don’t want to add another, submit the product to the backend
        if (!addAnother) {
            try {
                await addProduct(newProduct);
                alert(`Product "${newProduct.name}" with ${newProduct.variants.length} variants has been successfully added.`);
            
                // Reset product and variant fields after successful submission
                newProduct = {name: '', description: '', price: '', categoryId: null, newCategoryName: '', newCategorySlug: '', variants: [], url_slug: '', stock_quantity: '', image_url: ''};
                newVariant = { color: '', size: '', price: '', stock_quantity: '', image_url: '' };
                showVariantForm = true;  // Reset for future product additions
            }   catch (error) {
                    console.error('Error adding product:', error);
                    alert('There was an error adding the product. Please try again.');
            }
        }
    }


    // Toggle the visibility of the "Add Product" form
    const toggleAddProductForm = () => {
        showAddProductForm = !showAddProductForm;
    };




    // Delete product handler
    const handleDeleteProduct = async (id) => {
        if ($isAdmin) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await deleteProduct(id);
                
                // Update the products array to remove the deleted product
                products = products.filter(product => product.id !== id);
                
                alert('Product deleted successfully.');
                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert('There was an error deleting the product. Please try again.');
                }
            }
        } else {
            alert('You don’t have permission to delete this product');
        }
    };



    // Subscribe to the filtered products store
    filteredProducts.subscribe((data) => {
        products = data;
    });

    

    // Function to navigate to product details
    const goToProductDetails = (productId) => {
        navigate(`/products/${productId}`); // Use relative routing for navigation
    };



</script>



<!-- Categories Sidebar -->

<Headerfooter/>

<Carousel/>


<CategoryList/>




<!-- Search input -->

<div class="search-bar">
    <input
        type="text"
        placeholder="Search for products..."
        bind:value={searchTerm}
    />
</div>
    
<!-- Sort Dropdown -->
<div class="sort-container">
    <label for="sort-select">Sort</label>
    <select id="sort-select" bind:value={selectedSort}>
        <option value="low-to-high">Price:Low to High</option>
        <option value="high-to-low">Price:High to Low</option>
    </select>
</div>

<!-- Product Grid -->
<div class="product-grid">
    {#each filteredAndSortedProducts as product}
        <div class="product-card" on:click={() => goToProductDetails(product.id)}>
            <!-- Image Div -->
            <div class="product-image-container">
                {#if product.image_url}
                    <img src={product.image_url} alt={product.product_name} class="product-image" />
                {:else}
                    <p>No image</p>
                {/if}
            </div>

            <!-- Details Div -->
            <div class="product-details">
                <div class = "product-info-container">
                    <p class="product-name">{product.product_name}</p>
                    <p class="product-description">{product.description || 'No description'}</p>
                    <p class="product-price">₹{product.price.toFixed(2)}</p>
                </div>

                <!-- Show delete button only for admin -->
                {#if $isAdmin}
                    <button 
                        on:click={(event) => {
                            event.stopPropagation();
                            handleDeleteProduct(product.id);
                        }} 
                        class="delete-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png" alt="Delete Icon" class="delete-icon" />
                        
                    </button>
                {/if}
            </div> 
        </div>
    {/each}
</div>



<!-- Add Product Button -->
{#if $isAdmin}
    <!-- Add Product Button, visible only to admins -->
    <button on:click={toggleAddProductForm} class="add-product-button">
        Add New Product
    </button>
{/if}


{#if $isAdmin && showAddProductForm}
    <form on:submit|preventDefault={handleAddProduct}>
        <h2>Add New Product</h2>
        
        <label for="name">Product Name:</label>
        <input type="text" id="name" bind:value={newProduct.name} required>

        <label for="description">Description:</label>
        <textarea id="description" bind:value={newProduct.description} required></textarea>

        <label for="price">Price:</label>
        <input type="number" id="price" bind:value={newProduct.price} required>

        <label for="category">Category ID (if existing):</label>
        <input type="text" id="category" bind:value={newProduct.categoryId}>

        <label for="newCategoryName">New Category Name (if applicable):</label>
        <input type="text" id="newCategoryName" bind:value={newProduct.newCategoryName}>

        <label for="newCategorySlug">New Category Slug (if applicable):</label>
        <input type="text" id="newCategorySlug" bind:value={newProduct.newCategorySlug}>

        <label for = "url_slug">Url_Slug</label>
        <input type = "text" id = "url_slug" bind:value ={newProduct.url_slug} required>

        <label for="stock_quantity">Stock Quantity:</label>
        <input type="number" id="stock_quantity" bind:value={newProduct.stock_quantity} required>

        <label for="image_url">Main Product Image URL:</label>
        <input type="text" id="image_url" bind:value={newProduct.image_url} required>

        <h3>Variants</h3>
        <label for="color">Color:</label>
        <input type="text" id="color" bind:value={newVariant.color} required>

        <label for="size">Size:</label>
        <input type="text" id="size" bind:value={newVariant.size}>

        <label for="variant_price">Variant Price:</label>
        <input type="number" id="variant_price" bind:value={newVariant.price} required>

        <label for="variant_stock">Variant Stock Quantity:</label>
        <input type="number" id="variant_stock" bind:value={newVariant.stock_quantity} required>

        <label for="variant_image_url">Variant Image URL:</label>
        <input type="text" id="variant_image_url" bind:value={newVariant.image_url} required>

        <!-- Submit Product Button -->
        <button type="submit">Submit Product</button>
    </form>
{:else}
    <p></p>
{/if}


<!-- If no products are found -->
{#if products.length === 0}
    <p>No products found.</p>
{/if}



<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing:border-box;
        
    }

    

    .search-bar {
        margin: 10px;
        margin-top: 2px;
        padding: 10px;
        background-color: #f3f0f0;
        border-radius: 4px;
        display: flex;
        justify-content: center;
    }

    .search-bar input {
        width: 80%;
        padding: 8px;
        font-size: 16px;
        border-radius: 4px;
        color: #000000;
        background-color: #f9f9f9;
        border: 1px solid #ebebeb;
    }


   
    .sort-container {
        margin: 20px;
        display: flex;
        align-items: center;
        
        
    }

    label{
        color :#000000;
        font-size: 18px;
        font-weight: bold;
    }

    #sort-select {
        margin-left: 10px;
        padding: 5px;
        font-size: 16px;
        color: #000000;
        background-color: #f2f2f2;
        
    }
    .add-product-button{
        margin-left: auto;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: end;
        position: relative;
        top: 0;
    }

    
    .delete-btn {
        background-color: transparent;
        border: none;
        color: red; /* Button text color */
        font-size: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 10px;
        transition: background-color 0.3s ease;
    }

    .delete-btn:hover {
        background-color: #f2f2f2; /* Light gray on hover */
    }

    .delete-icon {
        width: 20px; /* Adjust the size of the icon */
        height: 20px; /* Keep the aspect ratio of the icon */
        margin-right: 8px; /* Space between the icon and text */
        vertical-align: middle; /* Align icon with text */
    }


    input[type="text"] {
        padding: 10px;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    
    .product-grid {
        display: grid;
        grid-template-columns: repeat(4,1fr); /* Responsive layout */
        gap: 20px; /* Space between the products */
        margin-bottom: 20px;
    }

    .product-card {
        background-color: #f9f9f9;
        border: none;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
        cursor: pointer;
        justify-content: space-between;
    }

    .product-card:hover {
        transform: scale(1.05);
    }

    .product-image-container{
        background-color: white;
        padding: 16px;
        text-align: center;
        overflow: hidden;

    }

    .product-image {
        width: 100%;
        height: 200px;
        object-fit: scale-down;
        transition: transform 0.3s ease;
    }

    .product-image:hover{
        transform: scale(1.2);
        transform-origin:center;
    }



    .product-name {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: start;
        color: #000000;
    }

    .product-price {
        color: #000000;
        font-weight: bold;
        text-align: start;
        font-size: 1.3rem;
    }

    .product-description {
        font-size: 0.9rem;
        color: #000000;
        text-align: start;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Limits to 2 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        max-height: 2.6em; /* Adjust this based on your line-height */
    }


    
    button {
        padding: 8px 12px;
        border: black;
        border-radius: 4px;
        background-color: #ffffff;
        color: rgb(20, 10, 10);
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #848985;
    }

    

    p {
        color: #666;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .product-grid {
            grid-template-columns: 1fr; /* One product per row for small screens */
        }
    }
</style>





