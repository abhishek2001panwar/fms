import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addCart,getCart,deleteCart } from '../controllers/cart.controller.js';


const router = express.Router();


router.post('/add', authMiddleware, addCart);
router.post('/get', authMiddleware, getCart);
router.post('/delete', authMiddleware, deleteCart);




export { router };