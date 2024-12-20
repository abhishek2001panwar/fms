import express from 'express';
import { login, register, getProfile  } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register',  register );
router.get('/auth-status' , authMiddleware, (req, res) => {
    res.json({ message: 'User is authenticated' });
});
router.post('/login',  login );
router.get('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
}); 
router.get('/profile',authMiddleware, getProfile)


export  {router};