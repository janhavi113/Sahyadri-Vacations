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
    console.log('Recipient Email:', recipientEmail);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // SMTP Transporter with connection pooling
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.HOSTINGER_EMAIL_USERNAME,
            pass: process.env.HOSTINGER_EMAIL_PASSWORD,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 10,
    });

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
    }

    // Email details
    const mailOptions = {
        from: process.env.HOSTINGER_EMAIL_USERNAME,
        to: recipientEmail,
        subject: `Invoice for Booking ${bookingDetails.bookingId}`,
        html: `
            <p>Hello <strong>${bookingDetails.name}</strong>,</p>
            <p>Greetings from <strong>Sahyadri Vacations and Adventures</strong>!</p>
            <p>We are thrilled to organize your <strong>${bookingDetails.eventName} (${bookingDetails.batch})</strong>.</p>
            <p>We have received your payment of <strong>INR ${bookingDetails.amountPaid}</strong>. Your Trek to <strong>${bookingDetails.eventName} (${bookingDetails.batch})</strong> is confirmed.</p>`,
        attachments: [
            {
                filename: path.basename(pdfPath),
                path: pdfPath,
            },
        ],
    };

    // Send email asynchronously
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
