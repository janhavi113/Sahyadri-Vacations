import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendInvoiceEmail = async (recipientEmail, pdfPath) => {
    console.log('recipientEmail----',recipientEmail);
    console.log('recipientEmail1----',process.env.MONGOODB_GMAIL_USERNAME);
    console.log('recipientEmail2----',process.env.MONGOODB_GMAIL_PASSWORD);
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MONGOODB_GMAIL_USERNAME,
            pass: process.env.MONGOODB_GMAIL_PASSWORD,
        },
    });

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
    }

    // Set up email data
    const mailOptions = {
        from: process.env.MONGOODB_GMAIL_USERNAME,
        to: recipientEmail,
        subject: 'Your Invoice',
        text: 'Please find attached your invoice.',
        attachments: [
            {
                filename: path.basename(pdfPath), // Use path module for better handling
                path: pdfPath,
            },
        ],
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
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
        throw error; // Propagate the error
    }
};
