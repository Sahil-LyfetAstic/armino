import express from "express";
const app = express.Router();
import {authMiddleware} from "../middleware/authMiddleware.js";
import {getCart,  addToCart,} from "../controllers/Cart.js";



app.get('/cart', authMiddleware, getCart);
app.post('/cart', authMiddleware, addToCart);
// app.get("/test",authMiddleware,cart)


export default app;

