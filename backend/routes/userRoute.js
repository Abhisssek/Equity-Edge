const express = require('express');
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/userController');
const router = express.Router();
const isAuth = require('../middleware/auth');


router.post('/register-user', registerUser);
router.post('/login-user', loginUser); 
router.post('/logout-user', logoutUser);
router.get('/user-profile', isAuth, getUserProfile);


module.exports = router;
