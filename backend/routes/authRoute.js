const express = require('express');
const router = express.Router();


// Import the auth middleware
const authMiddleware = require('../middleware/auth');

router.get('/protected', authMiddleware, (req, res) => {
    // This route is protected by the auth middleware
    res.status(200).json({ message: 'This is a protected route', user: req.user, success: true });
});



module.exports = router;