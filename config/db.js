import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = "mongodb+srv://20221039:eKvvP6ckAX06Uyae@prueba.afe17.mongodb.net/paulo_freiredb?retryWrites=true&w=majority&appName=PRUEBA";
        
        const conn = await mongoose.connect(mongoURI);
        const url = `${conn.connection.host}:${conn.connection.port}`;
        console.log(`MongoDB connected: ${url} ✅`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;




/*
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = "mongodb://localhost:27017/paulo_freiredb";
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${conn.connection.host}:${conn.connection.port}`;
        console.log(`MongoDB connected: ${url} ✅`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
*/