<script>
    import { validatePassword } from "../../../store";
    import { navigate } from "svelte-routing";
  
    let email = "";
    let password = "";
    let confirmPassword = "";
    let role = ""; // New: role selection
    let full_name = ""; // Full name field
    let phone_number = ""; // Phone number field
    let errorMessage = "";
    let successMessage = "";
    let isAuthenticated = false;

    // Function to handle the form submission for signing up
    async function signUp(event) {
        event.preventDefault(); // Prevent the default form submission
  
        // Log the form data to ensure values are captured
        console.log({ email, password, confirmPassword, role, full_name, phone_number });
  
        // Check if all fields are filled
        if (!email || !password || !confirmPassword || !role || !full_name || !phone_number) {
            errorMessage = "All fields including role, full name, and phone number are required.";
            return;
        }
  
        // Validate the password using the validation function
        const passwordError = validatePassword(password);
        if (passwordError) {
            errorMessage = passwordError;
            return;
        }
  
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            errorMessage = "Password and Confirm Password do not match.";
            return;
        }

        // If all validations pass, attempt to sign up
        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                    role,
                    full_name,
                    phone_number
                }), // Send all form data
            });
  
            const result = await response.json();
  
            if (response.ok) {
                successMessage = "Registration successful! You can now log in.";
                isAuthenticated = false; // Set to false until the user logs in
                navigate("/login");
            } else {
                errorMessage = result.message || "Sign-up failed. Please try again.";
            }
        } catch (error) {
            errorMessage = "Sign-up failed. Please check your details and try again.";
            console.error(error);
        }
    }
  
    // Function to navigate to the login page
    const signIn = () => {
        navigate('/login');
    };
</script>

<!-- Sign-up form -->
<form class="container" on:submit={signUp}>
    <h2>Sign Up</h2>
    
    <!-- Display error messages -->
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}
    
    <!-- Display success messages -->
    {#if successMessage}
        <div class="success-message">{successMessage}</div>
    {/if}
    
    <!-- Input fields -->
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
    <input type="password" placeholder="Confirm Password" bind:value={confirmPassword} required />
    <input type="text" placeholder="Full Name" bind:value={full_name} required />
    <input type="tel" placeholder="Phone Number" bind:value={phone_number} required />
    
    <!-- Role selection -->
    <select bind:value={role} required>
        <option value="" disabled selected>Select your role</option>
        <option value="user">User</option>
        <!--<option value="admin">Admin</option>-->
    </select>
  
    <!-- Submit button -->
    <button class="button1" type="submit">Sign Up</button>
</form>
  
<!-- Redirect to sign-in -->
<div class="redirect">
    <button class="button2" on:click={signIn}>Already have an account?</button>
</div>

<style>
    .container {
        max-width: 400px;
        margin: auto;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        background-color: #f9f9f9;
        transition: box-shadow 0.3s;
    }

    .container:hover {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    h2 {
        text-align: center;
        color: #444;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
        font-weight: bold;
    }

    input, select {
        width: 100%;
        padding: 14px;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        color: #444;
        border-radius: 8px;
        font-size: 16px;
        background-color: #f1f1f1;
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    input:focus, select:focus {
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.3);
        outline: none;
    }

    .button1 {
        width: 100%;
        padding: 14px;
        background: linear-gradient(45deg, #28a745, #218838);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
    }

    .button1:hover {
        background: linear-gradient(45deg, #218838, #1e7e34);
        transform: scale(1.05);
    }

    .button1:active {
        transform: scale(0.95);
    }

    .redirect {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 14px;
        color: #555;
    }

    .button2 {
        padding: 12px;
        font-size: 16px;
        border: 2px solid #007bff;
        background-color: white;
        color: #007bff;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
    }

    .button2:hover {
        background-color: #007bff;
        color: white;
    }

    .error-message, .success-message {
        text-align: center;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .error-message {
        color: #dc3545;
    }

    .success-message {
        color: #28a745;
    }
</style>
