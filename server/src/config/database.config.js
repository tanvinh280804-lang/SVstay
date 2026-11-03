import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully : ${mongoose.connection.host}`)
    }
    catch (error) {
        console.log("Database connection failed", error);
        throw error;
    }
}

export default connectDB