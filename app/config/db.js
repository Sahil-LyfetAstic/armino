import Mongoose from "mongoose";

const connectDb = () => {
  try {
    Mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
