import nodemailer from 'nodemailer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
export const sendEmail = async (recipientEmail, emailBody,subjectEmail) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Hostinger SMTP server
        port: 465, // Port for SSL
        secure: true, // Use SSL
        auth: {
            user: process.env.HOSTINGER_EMAIL_USERNAME, // Hostinger email address
            pass: process.env.HOSTINGER_EMAIL_PASSWORD, // Hostinger email password
        },
    });

    // Set up email data
    const mailOptions = {
        from: process.env.HOSTINGER_EMAIL_USERNAME, // Sender address
        to: recipientEmail, // Receiver's email
        subject: subjectEmail,
        html: emailBody,
    }
     // Send the email
     try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
