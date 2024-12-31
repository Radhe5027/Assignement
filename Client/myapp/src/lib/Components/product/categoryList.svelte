<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { navigate } from "svelte-routing";
    import ProductList from "./productList.svelte";
    import {fetchProducts, filterProducts, selectedSubcategoryId} from "../../../store"

    let categories = [];
    let isOpen = false; // Control the sidebar open/close state
    let openCategoryID = null; // store the ID of the currently open category
    let openSubcategoryID = null ;// Close any open subcategories when a category is toggled
    let products = [];
    let displayedProducts = [];
    let showAll = true

    // Fetch categories from the backend
    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories-with-subcategories');
            const data = await response.json();
            categories = data; // Assign fetched categories
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch categories when component mounts
    onMount(() => {
        getCategories();
    });

    // Handle category click to toggle subcategories
    const toggleCategory = (categoryId) => {
        openCategoryID = openCategoryID === categoryId ? null : categoryId;
        openSubcategoryID = null;
    };


    // Handle subcategory click
    const selectSubcategory = (subcategoryId) => {
        //selectedSubcategoryId.set(subcategoryId); // Set the selected subcategory in the store
        filterProducts(subcategoryId); // Trigger filtering in the store
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        isOpen = !isOpen;
    };

    function showAllProducts() {
        showAll = true;
    }

</script>

<style>
    /* Basic styling for the sidebar */
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 250px;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        opacity: 0.9;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000; /* Ensures the sidebar stays above other elements */
    }

    

    .sidebar.open {
        transform: translateX(0);
    }

    .toggle-button {
        position: fixed;
        top: 0px;
        left: 10px; /* Align to the left side of the page */
        cursor: pointer;
        font-size: 12px; /* Increase size for better visibility */
        font-weight: bold;
        background-color: #ffffff;
        color: rgb(0, 0, 0);
        padding: 10px;
        border-radius: 5px;
        z-index: 1100; /* Higher than sidebar to ensure visibility */
    }


    .toggle-button img {
        width: 20px;
        height: 20px;
    }

    
    .category-list {
        list-style: none;
        padding: 0;
        margin-top: 20px;
        
    }

    .category-item {
        padding: 10px 20px;
        cursor: pointer;
        color:rgb(0, 0, 0);
        font-style: oblique;
        
    }

    .category-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px; /* Space between the icon and the category name */
    }

    .subcategory-list {
        list-style: none;
        padding: 5px; /* Indent subcategories */
        padding-left: 80px;
        display: none; /* Hide by default */
    }

    .subcategory-list.open {
        display: block; /* Show when open */
    }

    .subcategory-item {
        padding: 3px 0;
        cursor: pointer;
        color: rgb(0, 0, 0);
        
    }

    .nested-subcategory-list {
    list-style: none;
    padding: 0 40px; /* Further indent nested subcategories */
    display: none; /* Hide by default */
    }

    .nested-subcategory-item {
    padding: 5px 0; /* Smaller padding for nested items */
    cursor: pointer; /* Add cursor for better UX */
    }

    .products {
        margin-left: 270px;
        padding: 20px;
    }

    .product-item {
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }
</style>

<div>
    <div class="toggle-button" on:click={toggleSidebar}>
        <img src="https://cdn-icons-png.flaticon.com/128/4743/4743041.png" alt="Categories" />
        
    </div>
    <div class={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul class="category-list">
            <li class="category-item" on:click = {() => window.location.href = '/'}>
                <strong>All Products</strong>
            </li>
            {#each categories as category}
                <li class="category-item" on:click={() => toggleCategory(category.id)}>
                    <img src="https://cdn-icons-png.flaticon.com/128/10412/10412527.png" alt="Category Icon" class="category-icon" />
                    <strong>{category.category_name}</strong>
                    {#if category.subcategories && category.subcategories.length > 0}
                        <ul class={`subcategory-list ${openCategoryID === category.id ? 'open' : ''}`}>
                            {#each category.subcategories as subcategory}
                                <li class="subcategory-item" on:click={() => selectSubcategory(subcategory.id)}>
                                    {subcategory.category_name}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</div>


