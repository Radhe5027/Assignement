<script>
  import {Router, Route, navigate,useLocation} from 'svelte-routing';
  import LoginForm from './lib/Components/auth/loginForm.svelte';
  import SignupForm from './lib/Components/auth/signupForm.svelte';
  import OrderConfirmation from './lib/Components/cart/orderconfirmation.svelte';
  import ShippingAddressForm from './lib/Components/cart/shippingadressForm.svelte';
  import Wishlist from './lib/Components/cart/wishlist.svelte';
  import Checkout from './lib/Components/cart/checkout.svelte';
  import Cart from './lib/Components/cart/cart.svelte';
  import CategoryList from './lib/Components/product/categoryList.svelte';
  import ProductDetail from './lib/Components/product/productDetails.svelte';
  import ProductList from './lib/Components/product/productList.svelte';
  import ShippingadressForm from './lib/Components/cart/shippingadressForm.svelte';
  import Orderconfirmation from './lib/Components/cart/orderconfirmation.svelte';
  import Headerfooter from './lib/Components/header/headerfooter.svelte';
  import { onMount,setContext } from 'svelte';
  



  

  let userRole = ''; // This will hold the role of the user (e.g., 'admin' or 'user')
  




  





// Check if the user is logged in and retrieve their role from the JWT token or localStorage
function checkUserRole() {
  const token = localStorage.getItem('jwtToken'); // Assuming the JWT token is stored in localStorage
  if (token) {
    try {
      // Decode JWT to get the role (This assumes the role is part of the JWT payload)
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding the JWT
      userRole = decodedToken.role; // Assuming the role is stored in the 'role' field
    } catch (error) {
      console.error('Error decoding token:', error);
      userRole = ''; // Set to empty string in case of error
    }
  }
}



// Call the function on component load to get the role
checkUserRole();

// A helper function to check if the user has admin rights
function isAdmin() {
  return userRole === 'admin';
}

// Protect admin routes and redirect if necessary
function protectAdminRoute() {
  if (!isAdmin()) {
    alert("Access denied. Admins only.");
    navigate('/login');
  }
}


</script>
  


<style>
  .main-content {
      padding: 1rem;
  }

</style>



<!-- Main content area with protected and public routes -->
<main class="main-content">
  <Router>
      <div>
          <!-- Public Routes -->
          <Route path="/" component={ProductList} />
          <Route path="/signup" component={SignupForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/categories" component={CategoryList} />
          <Route path="/products/:id" component={ProductDetail} />

          <!-- Protected Routes (Admin Only) -->
          <Route path="/cart" component={Cart} on:route={protectAdminRoute} />
          <Route path="/shipping" component={ShippingAddressForm} on:route={protectAdminRoute} />
          <Route path="/order-confirmation" component={OrderConfirmation} />
          <Route path = '/orders' component = {Checkout} />
          <Route path = '/wishlist' component = {Wishlist}/>
      </div>
  </Router>
</main>



  