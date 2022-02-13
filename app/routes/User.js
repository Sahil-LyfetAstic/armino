import express from "express";
import {signIn, signUp} from "../controllers/User.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
const app = express.Router();



app.post('/signup', signUp);
app.post('/signin', signIn);





export default app;