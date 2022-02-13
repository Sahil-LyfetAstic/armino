import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./app/routes/User.js";
import connectDb from "./app/config/db.js";
import productRouter from "./app/routes/Product.js";
import cartRouter from "./app/routes/Cart.js";


dotenv.config();

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
connectDb()



// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API." });
});

app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);




const PORT = process.env.PORT || 3000;
try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.log(error);
}



export default app;
