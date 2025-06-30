const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access, Login First' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Unauthorized access, invalid token' });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.userId = user._id; // Attach user ID to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Error in authMiddleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = authMiddleware;