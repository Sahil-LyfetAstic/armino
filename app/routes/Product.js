import express from "express";
const app = express.Router();
import {getProducts} from "../controllers/Product.js";
import {authMiddleware} from "../middleware/authMiddleware.js";


app.get("/products", authMiddleware, getProducts);



export default app;