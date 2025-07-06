const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req,res)=>{
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const isUsernameTaken = await User.findOne({ username });
        if (isUsernameTaken) {
            return res.status(400).json({ message: 'Username is already taken', success: false });
        }
        const isUserRegistered = await User.findOne({email})
        if(isUserRegistered){
            return res.status(400).json({ message: 'Email is already registered', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Adjust as needed
        });

        return res.status(201).json({
            message: 'User registered successfully',
            savedUser,
            success: true
        });

    } catch (error) {
        console.log('Error in registerUser:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required', success: false });
        }
        const user = await User.findOne({ email });
        if (!user || user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }

      const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Adjust as needed
        });
        return res.status(200).json({
            message: 'User logged in successfully',
            user,
            success: true
        });

    } catch (error) {
        console.log('Error in loginUser:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}



exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No user is logged in', success: false });
        }
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Adjust as needed
        });

        return res.status(200).json({ message: 'User logged out successfully', success: true });
    } catch (error) {
        console.log('Error in logoutUser:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getUserProfile = async (req, res) => {
    try {

        const id = req.userId; // Assuming userId is set in the request object by a middleware
        if (!id) {
            return res.status(400).json({ message: 'User ID is required', success: false });
        }
        const user = await User.findById(id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        return res.status(200).json({
            message: 'User profile retrieved successfully',
            user,
            success: true
        });
        
    } catch (error) {
        console.log('Error in getUserProfile:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}