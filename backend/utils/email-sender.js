import nodemailer from 'nodemailer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
// Function to convert an image to Base64
const getImageAsBase64 = (filePath) => {
    const imageBuffer = fs.readFileSync(path.resolve(filePath));
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
};

export const sendInvoiceEmail = async (recipientEmail, bookingDetails, pdfPath) => {
    console.log('recipientEmail:', recipientEmail);
    console.log(' process.env.HOSTINGER_EMAIL_USERNAME:', process.env.HOSTINGER_EMAIL_USERNAME);
    console.log(' process.env.HOSTINGER_EMAIL_PASSWORD:', process.env.HOSTINGER_EMAIL_PASSWORD);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Construct the path to the logo
    const logo = path.join(__dirname, '../../public/logo.png');
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
        subject: `Invoice for Booking ${bookingDetails.bookingId}`,
        //text: 'Please find attached your invoice.',
        html: `
    <p>Hello <strong>${bookingDetails.name}</strong>,</p>
    <p>Greetings from <strong>Sahyadri Vacations and Adventures</strong>!</p>
    <p>
        We are glad that you chose <strong>Sahyadri Vacations and Adventures</strong> to organize your <strong>${bookingDetails.eventName} ( ${bookingDetails.batch} )</strong>. We are thrilled as much as you to take this journey together.
    </p>
    <p>
        We have received your payment of <strong>INR ${bookingDetails.amountPaid}</strong>. Your Trek to <strong>${bookingDetails.eventName} ( ${bookingDetails.batch} )</strong> is confirmed.
    </p>`,
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
        console.log('Email sent:', info.response);
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
