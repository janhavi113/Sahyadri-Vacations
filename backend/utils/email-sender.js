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
        port: 587,
        secure: false,
        auth: {
            user: process.env.HOSTINGER_EMAIL_USERNAME,
            pass: process.env.HOSTINGER_EMAIL_PASSWORD,
        },
        pool: true, // Enable connection pooling
        rateLimit: 10 // Send 10 emails per second
    });

    // Check if the PDF file exists
    if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file does not exist');
    }
    let remainingAmountMessage = '';
     if(bookingDetails.remainingAmount > 0){
        remainingAmountMessage = `<p>Please note: stating the booking is confirmed, but the remaining balance INR ${bookingDetails.remainingAmount} must be paid two days before the journey starts to retain the reservation. </p>`;
     }
    // Email details
    const mailOptions = {
        from: process.env.HOSTINGER_EMAIL_USERNAME,
        to: 'janhavi9826@gmail.com',
        subject: `Invoice for Booking ${bookingDetails.bookingId}`,
        html: `
            <p>Hello <strong>${bookingDetails.name}</strong>,</p>
            <p>Greetings from <strong>Sahyadri Vacations and Adventures</strong>!</p>
            <p>We are thrilled to organize your <strong>${bookingDetails.eventName} (${bookingDetails.batch})</strong>.</p>
            <p>We have received your payment of <strong>INR ${bookingDetails.amountPaid}</strong>. Your Trek to <strong>${bookingDetails.eventName} (${bookingDetails.batch})</strong> is confirmed.</p> ${remainingAmountMessage}`,
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
