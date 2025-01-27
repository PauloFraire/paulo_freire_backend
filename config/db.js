
// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         const mongoURI = "mongodb+srv://20221039:eKvvP6ckAX06Uyae@prueba.afe17.mongodb.net/paulo_freiredb?retryWrites=true&w=majority&appName=PRUEBA";
        
//         const conn = await mongoose.connect(mongoURI);
//         const url = `${conn.connection.host}:${conn.connection.port}`;
//         console.log(`MongoDB connected: ${url} ✅`);
//     } catch (error) {
//         console.log(`Error: ${error.message}`);
//         process.exit(1);
//     }
// };

// export default connectDB;





import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/paulo_freiredb"; // Asegúrate de usar 127.0.0.1 para evitar problemas con IPv6

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port} ✅`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Finaliza el proceso si hay un error
    }
};

export default connectDB;