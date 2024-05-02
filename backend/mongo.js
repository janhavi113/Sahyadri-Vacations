import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let userName = process.env.MONGOODB_USERNAME;
let password = process.env.MONGOODB_PASSWORD;
console.log('userName--',userName);
console.log('password--',password);
let url =`mongodb+srv://${userName}:${password}@testdb.90vgjim.mongodb.net/Sahyadri-Vacations`;
let conn = await mongoose.connect(url)
export default conn;