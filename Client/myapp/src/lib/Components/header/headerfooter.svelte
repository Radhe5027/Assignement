<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let userName = "";
  let isDropdownOpen = false;
  let wishlist = []; // Store wishlist items here

  // Fetch the wishlist from the backend
  async function fetchWishlist() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          wishlist = data.wishlist; // Assuming the response is in the format: { wishlist: [ ... ] }
        } else {
          console.error("Failed to fetch wishlist");
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("selectedAddress");
    navigate("/login");
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function closeDropdown(event) {
    if (!event.target.closest('.profile') && !event.target.closest('.dropdown')) {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userName = payload.full_name || "User";
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    // Fetch the wishlist data
    fetchWishlist();

    // Adding event listener for clicking outside the dropdown
    document.addEventListener("click", closeDropdown);
    return () => {
      // Cleanup the event listener on component destroy
      document.removeEventListener("click", closeDropdown);
    };
  });
</script>

<style>
  nav {
    background-color: rgb(242, 241, 241);
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 130px;
    width: 100%;
    z-index: 1000;
  }

  .header-container {
    display: flex;
    align-items: center;
    margin-top: 5px;
    gap: 5em;
  }

  .nav-links {
    display: flex;
    margin-left: 700px;
    gap: 2em;
    
  }

  .nav-links a {
    position: relative;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-links a img {
    width: 27px;
    height: 27px;
  }

  .nav-links a:hover {
    background-color: rgb(242, 241, 241);
    border-radius: 4px;
  }

  .nav-links a::after {
    content: attr(data-hover);
    position: absolute;
    bottom: -1.5em;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.3em 0.6em;
    border-radius: 4px;
    font-size: 0.9em;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s, transform 0.3s;
    white-space: nowrap;
  }

  .nav-links a:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 1em;
    cursor: pointer;
    position: relative;
  }

  .profile img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .username {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-style: italic;
    font: 5em;
    color: #333;
  }

  

  
</style>

<!-- Header Section -->
<nav>
  <div class="header-container">

    <div class="profile" on:click={toggleDropdown}>
      <img src="https://cdn-icons-png.flaticon.com/128/17593/17593656.png" alt="User Profile" />
      <div class="username">Welcome, {userName}</div>

      <!-- {#if isDropdownOpen}
        <div class="dropdown" on:click|stopPropagation>
          <a href="/login" on:click|preventDefault={handleLogout}></a>
        </div>
      {/if} -->
    </div>
    <!-- Navigation Links -->
    <div class="nav-links">
      <a href="/"class="hover-text" data-hover="Home">
        <img src="https://cdn-icons-png.flaticon.com/128/2948/2948025.png" alt="Home" />
        
      </a>
      <a href="/cart"class="hover-text" data-hover="Cart">
        <img src="https://cdn-icons-png.flaticon.com/128/891/891462.png" alt="Cart" />
        
      </a>
      <a href="/wishlist"class="hover-text" data-hover="Wishlist">
        <img src="https://cdn-icons-png.flaticon.com/128/11230/11230790.png" alt="Wishlist" />
        
      </a>

      <a href = "/orders"class="hover-text" data-hover="Orders">
        <img src = "https://cdn-icons-png.flaticon.com/128/9422/9422789.png" alt ="Orders" />
      </a>

      <a href = "/login" class = "hover-text" data-hover = "Logout">
        <img src = "https://cdn-icons-png.flaticon.com/128/3329/3329438.png" alt = "logout"/>
      </a>
    </div>

    
    
  </div>
</nav>
