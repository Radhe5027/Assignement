const Users = require('../../model/users'); // Adjust the path as needed
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT

exports.signupUsers = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        // Validate input fields...
        // (Include your existing validation logic here)

        // Assign role, default to 'user' if not provided or invalid role
        const userRole = role && ['admin', 'user'].includes(role) ? role : 'user';

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.create({ email, password: hashedPassword, role: userRole });

        return res.status(201).json({ message: 'SignUp successful', role: userRole });
    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.loginUsers = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logoutUsers = (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware that adds user info to req
        const user = await user.findByPk(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware that adds user info to req
        const { email, password } = req.body; // Get other fields as necessary
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.email = email;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        await user.save();
        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
