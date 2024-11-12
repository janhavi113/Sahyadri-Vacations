import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendInvoiceEmail = async (recipientEmail, pdfPath) => {
    console.log('recipientEmail:', recipientEmail);
    console.log(' process.env.HOSTINGER_EMAIL_USERNAME:',  process.env.HOSTINGER_EMAIL_USERNAME);
    console.log(' process.env.HOSTINGER_EMAIL_PASSWORD:',  process.env.HOSTINGER_EMAIL_PASSWORD);
    // Create a transporter with Hostinger SMTP settings
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Hostinger SMTP server
        port: 465, // Port for SSL
        secure: true, // Use SSL
        auth: {
            user: process.env.HOSTINGER_EMAIL_USERNAME, // Hostinger email address
            pass: process.env.HOSTINGER_EMAIL_PASSWORD, // Hostinger email password
        },
    });

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
    }

    // Set up email data
    const mailOptions = {
        from: process.env.HOSTINGER_EMAIL_USERNAME, // Sender address
        to: recipientEmail, // Receiver's email
        subject: 'Your Invoice',
        text: 'Please find attached your invoice.',
        attachments: [
            {
                filename: path.basename(pdfPath),
                path: pdfPath,
            },
        ],
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);

        // Delete the PDF file after sending the email
        fs.unlink(pdfPath, (err) => {
            if (err) {
                console.error(`Error deleting the PDF: ${err}`);
            } else {
                console.log(`PDF deleted: ${pdfPath}`);
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
