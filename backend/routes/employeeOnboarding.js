import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { Employee } from "../models/Employee.js";

const router = express.Router();

// ✅ POST /onboard-employee
router.post("/onboard-employee", async (req, res) => {
  try {
    const { Username, Email, Role } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ Email });
    if (existing) {
      return res.status(400).json({ isSuccess: false, message: "Employee already exists." });
    }

    // Generate password setup token
    const setupToken = jwt.sign({ Email }, process.env.JWT_SECRET, { expiresIn: "2d" });

    // Temporary password (hashed, not used for login)
    const hashedPassword = await bcrypt.hash("temporary", 10);

    // Save new employee
    const newEmployee = new Employee({
      Username,
      Email,
      Password: hashedPassword,
      Role,
    });

    await newEmployee.save();
    let baseUrl ='';
    // Password setup link
    if(process.env.NODE_ENV == 'dev'){
           baseUrl='http://localhost:5173/';
    }else{
           baseUrl='https://sahyadrivacations.com/';
    }
    const setupLink = `${baseUrl}set-password?token=${setupToken}`;

   // SMTP Transporter with connection pooling
       const transporter = nodemailer.createTransport({
           host: 'smtp.hostinger.com',
           port: 587,
           secure: false,
           auth: {
               user: process.env.HOSTINGER_EMAIL_USERNAME,
               pass: process.env.HOSTINGER_EMAIL_PASSWORD,
           },
           pool: true, // Enable connection pooling
           rateLimit: 10 // Send 10 emails per second
       });

    // ✉️ Email content
    const mailOptions = {
      from: `"Sahyadri Vacations" ${process.env.HOSTINGER_EMAIL_USERNAME}`,
      to: Email,
      subject: "🎉 Congratulations on Joining Sahyadri Vacations!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2b7cff;">Welcome to Sahyadri Vacations, ${Username}!</h2>
            <p>We’re excited to have you onboard 🎊</p>
            <p>Your employee account has been successfully created. To get started, please reset your password using the button below.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${setupLink}" 
                style="background-color: #2b7cff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Reset Your Password
              </a>
            </div>

            <p>If the button doesn’t work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2b7cff;">${setupLink}</p>

            <p>This link will expire in <strong>2 days</strong>.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #666;">Best regards,<br><strong>Team Sahyadri Vacations</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      isSuccess: true,
      message: "Employee onboarded successfully. Email sent with password setup link.",
    });
  } catch (err) {
    console.error("Onboard employee error:", err);
    res.status(500).json({ isSuccess: false, message: "Something went wrong." });
  }
});

// ✅ POST /set-password
router.post("/set-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ isSuccess: false, message: "Missing token or password." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ isSuccess: false, message: "Invalid or expired link." });
    }

    const employee = await Employee.findOne({ Email: decoded.Email });
    if (!employee) {
      return res.status(404).json({ isSuccess: false, message: "Employee not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    employee.Password = hashedPassword;
    await employee.save();

    res.json({ isSuccess: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Set password error:", err);
    res.status(500).json({ isSuccess: false, message: "Server error." });
  }
});

router.get("/get-employees", async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json({ isSuccess: true, employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ isSuccess: false, message: "Server error" });
  }
});
export default router;
