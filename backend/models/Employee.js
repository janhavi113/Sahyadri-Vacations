import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
});


export const Employee = mongoose.model('Employee', employeeSchema);