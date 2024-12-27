import express from 'express';
import { login, register, getProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.get('/auth-status', authMiddleware, (req, res) => {
    res.json({ message: 'User is authenticated' });
});
router.post('/login', login);

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/profile', authMiddleware, getProfile)


export { router };