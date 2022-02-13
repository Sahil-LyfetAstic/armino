import mongoose from "mongoose";
import dotnev from "dotenv";
import Product from "../utils/Product.js";
import productModel from "../models/Product.js";
import connectDb from "../config/db.js";


dotnev.config();
connectDb();


// seeder to insert Product to database

const seeder = async () => {
    try {
        const products = await productModel.find();
        if (products.length > 0) {
            return;
        }
        const product = await productModel.insertMany(Product);
        console.log(product);
        process.exit(0);
    } catch (error) {
        console.log(error);
        
    }
}


seeder();