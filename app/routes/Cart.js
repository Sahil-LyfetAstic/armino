import express from "express";
const app = express.Router();
import {authMiddleware} from "../middleware/authMiddleware.js";
import {getCart,verifyCoupon,  addToCart,} from "../controllers/Cart.js";



app.get('/cart', authMiddleware, getCart);
app.post('/cart', authMiddleware, addToCart);
app.post('/coupon', authMiddleware, verifyCoupon);


export default app;

