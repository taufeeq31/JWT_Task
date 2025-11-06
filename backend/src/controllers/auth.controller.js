import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Taking Name, Email, Password
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing Name or Email or Password' });
        }

        const exists = await User.findOne({ email }); // Check if user already exists
        if (exists) return res.status(400).json({ message: 'User exists' });

        const hashed = await bcrypt.hash(password, 10); // Hash the password
        const user = await User.create({ name, email, password: hashed }); // Create new user

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server misconfigured: missing JWT secret' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Generate JWT token

        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Taking Email, Password
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({ email }); // Find user by email
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password); // Compare passwords
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server misconfigured: missing JWT secret' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Generate JWT token

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}; // Not needed because i am using token-based auth, but added for completeness
