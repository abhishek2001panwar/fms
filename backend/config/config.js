
import mongoose from "mongoose";

export const connect = ()=>{
    try {
        const connection = mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected" );
        
    } catch (error) {
        console.log(error);
    }
}