const Users = require("../../model/users"); // Adjust the path as needed
const UserRole = require("../../model/user_roles");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT

exports.signupUsers = async (req, res) => {
  try {
    const { email, password, confirmPassword, role, full_name, phone_number } =
      req.body;

    // Basic validation for required fields
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !full_name ||
      !phone_number
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Assign role, default to 'user' if not provided or invalid role
    const userRole = role && ["admin", "user"].includes(role) ? role : "user";

    // Check if the specified role exists in the user_role table
    const existingRole = await UserRole.findOne({
      where: { role_name: userRole },
    });
    if (!existingRole) {
      return res.status(400).json({ error: "Invalid role provided" });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({
      email,
      password: hashedPassword,
      role_id: existingRole.id, // Assuming role_id corresponds to the UserRole table's id
      full_name,
      phone_number,
    });

    return res
      .status(201)
      .json({ message: "SignUp successful", role: userRole });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id,
        full_name: user.full_name,
        email: user.email,
        role: UserRole.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logoutUsers = (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that adds user info to req
    const user = await user.findByPk(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that adds user info to req
    const { email, password } = req.body; // Get other fields as necessary
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
