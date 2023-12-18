import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

(async()=>{
    try {
        mongoose.set("strictQuery", false)
        const db = await mongoose.connect(MONGO_URL);
        console.log("base de datos conectada", db.connection.name)
    } catch (error) {
        console.log(error)
    }
})()