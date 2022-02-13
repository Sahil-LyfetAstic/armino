import mongoose  from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
        trim: true
    },
 
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});


//create jwt token
UserSchema.methods.getSignedJwtToken = function(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//hash password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }  else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }   next();
});




UserSchema.methods.matchPassword = function(enteredPassword,userPassword) {

    return bcrypt.compare(enteredPassword, userPassword);
};



export default mongoose.model("User", UserSchema);
