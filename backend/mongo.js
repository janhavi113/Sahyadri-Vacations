import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let userName = process.env.MONGOODB_USERNAME;
let password = process.env.MONGOODB_PASSWORD;
console.log('userName--',userName);
console.log('password--',password);
let url =`mongodb+srv://${userName}:${password}@testdb.90vgjim.mongodb.net/Sahyadri-Vacations`;
const main = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };
  
  main().catch(console.error);
  
  export default main;