import { Cart } from "../models/cart.models.js";
import { File } from "../models/file.models.js";


export const addCart = async (req, res) => {
    const { fileId } = req.body; // Assuming fileId is passed in the request body
    const userId = req.userId; // Assuming user ID is stored in req.user
    try {
        // Check if the file exists
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Find the user's cart and add the file reference
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $addToSet: { files: fileId } }, // Add the file to the cart, avoiding duplicates
            { new: true, upsert: true } // Create a new cart if one doesn't exist
        );

        if (!cart) {
            return res.status(500).json({ message: 'Failed to add file to cart' });
        }

        res.status(200).json({ cart, message: 'File added to cart successfully' });
    } catch (error) {
        console.error('Error adding file to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCart = async (req, res) => {
    const userId = req.userId; // Assuming user ID is stored in req.user
    try {
        // Find the user's cart and populate the files
        const cart = await Cart.findOne({ user: userId }).populate('files');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCart = async (req, res) => {
    const userId = req.userId; // Assuming user ID is stored in req.user
    try {
        // Find and delete the user's cart
        const cart = await Cart.findOneAndDelete({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};