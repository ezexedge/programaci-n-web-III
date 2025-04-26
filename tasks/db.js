import mongoose from "mongoose";
import Task from "./models/Task.js";

export async function database() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB°°!!!!!");
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
    }
}
