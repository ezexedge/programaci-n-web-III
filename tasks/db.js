import mongoose from "mongoose";
import Task from "./models/Task.js";

export async function database() {
    try {
        
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/my_database";

        await mongoose.connect(mongoUri);
        console.log("Conectado a MongoDB°°!!!!!");
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
    }
}
