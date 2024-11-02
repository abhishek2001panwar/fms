
import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting format "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user information to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

