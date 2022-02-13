import User from '../models/User.js';
import Validator from 'validatorjs';

//signup 

export const signUp = async (req, res) => {
  
    const { email, password, phoneNumber, firstName } = req.body;

    let validation = new Validator(req.body, {
        email: 'required|email',
    });

    if(validation.fails()) return res.status(400).json({ message: validation.errors.all() });

    try {

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: 'User already exists',
            });
        }
        
        const newUser = new User({
            email,
            password,
            phoneNumber,
            firstName
        });
        let userDetail = await newUser.save();
        console.log(userDetail)
        const token = User.schema.methods.getSignedJwtToken(userDetail._id);
        res.status(201).json({
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error',
        });
    }
};
        



export const signIn = async (req, res) => {


    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist',
            });
        }
 
     
        const isMatch = await User.schema.methods.matchPassword(password,user.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid credentials',
            });
        }
        const token = User.schema.methods.getSignedJwtToken(user._id);
        console.log(token)
        res.status(200).json({
            message: 'Login successfully',
            token,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: 'Server error',
        });
    }
}
