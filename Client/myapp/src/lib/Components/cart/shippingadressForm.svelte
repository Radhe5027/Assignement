<script>
    import { onMount } from 'svelte';
    import { createShippingAddress, getShippingAddresses,deleteShippingAddress } from '../../../store';
    

    let user_id = null;
    let full_address = '';
    let state = '';
    let city = '';
    let zip_code = '';
    let addresses = [];
    let errorMessage = '';
    let showAddressForm = false;
    export let handleAddressSelection;
    





    // Fetch addresses on component mount
    onMount(async () => {
        try {
            addresses = await getShippingAddresses(); // Fetch all addresses
            if (addresses.length === 0) {
                // Show address form if no addresses are available
                showAddressForm = true;
                errorMessage = "Kindly add address to place order.";
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
            errorMessage = error.message; // Store error message for display
        }
    });

    async function handleSubmit() {
        const newAddress = {
            full_address,
            state,
            city,
            zip_code
        };

        try {
            const response = await createShippingAddress(newAddress);
            if (response && response.shippingAddress) {
                addresses = [...addresses, response.shippingAddress];
                resetForm();
                errorMessage = '';
            } else {
                throw new Error(response.message || "Failed to create address");
            }
        } catch (error) {
            errorMessage = error.message;
            console.error("Error creating address:", error);
        }
    }

    function resetForm() {
        full_address = '';
        state = '';
        city = '';
        zip_code = '';
    }

    async function handleDeleteAddress(id) {
    try {
        const response = await deleteShippingAddress(id);
        console.log("Delete Response:", response); // Log the response for debugging
        
        // Check if the response indicates success
        if (response.success) {
            // Remove the deleted address from the addresses array
            addresses = addresses.filter(address => address.id !== id);

            // Also, remove the deleted address from localStorage (if it's stored there)
            const storedAddresses = JSON.parse(localStorage.getItem('selectedAddress')) || [];
            const updatedAddresses = storedAddresses.filter(address => address.id !== id);
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses)); // Update localStorage
            
            console.log(`Address with id ${id} removed from localStorage.`);
        } else {
            throw new Error(response.message || "Failed to delete address");
        }
    } catch (error) {
        console.error("Error deleting address:", error);
        errorMessage = error.message; // Display error message
    }
};

// Save the selected address to localStorage
function handleSelection(event) {
    const selectedId = event.target.value;
    const selectedAddr = addresses.find(address => address.id == selectedId);

    if (selectedAddr) {
        const formattedAddress = `${selectedAddr.full_address}, ${selectedAddr.city}, ${selectedAddr.state}, ${selectedAddr.zip_code}`;
        localStorage.setItem('selectedAddress', formattedAddress); // Save the formatted address
        console.log('Address saved:', formattedAddress); // Log confirmation
    }
}





</script>

<style>
    /* Remove the header */

    .delete-icon {
    width: 28px; /* Adjust size */
    height: 28px; /* Maintain aspect ratio */
    cursor: pointer;
    margin-left: 15px;
    opacity: 0.9; /* Slight transparency */
    filter: hue-rotate(0deg) saturate(500%) brightness(0.8); /* Red color */
    }

    .delete-icon:hover {
        opacity: 0.8; /* Optional: Add a hover effect */
    }

    /* Main styling for the form container */
    .address-form-container {
        background-color: rgb(242, 241, 241);
        padding: 1px;
        border-radius: 8px;
        
        margin-top: 90px;
        color: rgb(0, 0, 0);
    }

    .address-select-container {
        margin-top: 50px;
        background-color: rgb(242, 241, 241); /* Darker background for the select option */
        padding: 5px;
        border-radius: 1px;
        border: 2px solid rgb(242, 241, 241); /* Slightly lighter border for contrast */
    }

    .address-select-container label {
        color: #000000; /* Label text color */
        font-weight: bold;
        font-size: 16px;
    }

    /* Style for the form elements */
    form {
        display: flex;
        flex-direction: column;
        gap: 15px; /* Add gap between input fields */
    }

    label {
        font-weight: bold;
        color: #000000;
        font-size: 14px;
    }

    input {
        padding: 7px;
        border: 1px solid #ccc;
        background-color: rgb(242, 241, 241);
        border-radius: 4px;
        color: #000000;
        font-size: 13px;
        width: 100%;
    }

    input:focus {
        border-color: #007BFF;
        outline: none;
    }

    button {
        padding: 7px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
    }

    button:hover {
        background-color: #0056b3;
    }

    /* Style for the error message */
    .error-message {
        color: red;
        margin-top: 10px;
        font-weight: bold;
    }

    /* Address list styling */
    .address-list {
        margin-top: 1px;
        background-color: rgb(242, 241, 241);
        border-radius: 8px;
        padding: 1px;
        border: 1px solid rgb(242, 241, 241);
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        padding: 12px;
        background-color: rgb(242, 241, 241);
        border: 1px solid rgb(242, 241, 241);
        margin: 8px 0;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    li input[type="radio"] {
        margin-right: 10px;
    }

    .add-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-left: 9px;
        opacity: 0.6;
        
    }

    .add-icon:hover {
        opacity: 1; /* Slight hover effect */
    }
</style>

<!-- Conditionally show the form if 'showAddressForm' is true -->
{#if showAddressForm}
    <div class="address-form-container">
        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <label>Full Address</label>
                <input type="text" bind:value={full_address} required />
            </div>
            <div>
                <label>State</label>
                <input type="text" bind:value={state} required />
            </div>
            <div>
                <label>City</label>
                <input type="text" bind:value={city} required />
            </div>
            <div>
                <label>ZIP Code</label>
                <input type="text" bind:value={zip_code} required />
            </div>
            <button type="submit">Add Address</button>
        </form>
    </div>
{/if}

{#if errorMessage}
    <p class="error-message">{errorMessage}</p>
{/if}

<!-- Address Selection Section -->
<div class="address-select-container">
    <label for="shippingAddress">Select Shipping Address</label>
    <div class="address-list">
        <ul>
            {#each addresses as address}
                <li>
                    <input type="radio" name="shippingAddress" id={address.id} value={address.id} on:change={handleSelection} />
                    <label for={address.id}>{address.full_address}, {address.city}, {address.state}, {address.zip_code}</label>

                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/3032/3032220.png"
                        alt="Add"
                        class="add-icon"
                        on:click={() => showAddressForm = !showAddressForm} />
                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/3221/3221845.png"
                        alt="Delete"
                        class="delete-icon"
                        on:click={() => handleDeleteAddress(address.id)} />
                </li>
            {/each}
        </ul>
    </div>
</div>



