//create a jwt token middleware
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({
            error: 'No token, authorization denied',
        });
    }
    try {
        const decoded = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({
            error: 'Token is not valid',
        });
    }
}