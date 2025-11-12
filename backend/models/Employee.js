import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    Username: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: {
    type: String,
    enum: ["super_admin", "admin", "manager", "leader"],
    default: "leader"
  }
});


export const Employee = mongoose.model('Employee', employeeSchema);