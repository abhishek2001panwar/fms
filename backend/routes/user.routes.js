import express from 'express';
import { login, register } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/register',  register );
router.post('/login',  login );
router.get('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
}); 
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});

export  {router};