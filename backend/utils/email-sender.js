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
    // Signature
    const signature = `
                <p>Best regards,</p>
                <p><strong>Sahyadri Vacations and Adventures</strong></p>
                <p>Contact: 7028740961</p>
                <p>Website: <a href="https://sahyadrivacations.com/">sahyadrivacations.com</a></p>
                `;
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
    if (bookingDetails.remainingAmount > 0) {
        remainingAmountMessage = `<p><strong>Please note: stating the booking is confirmed, but the remaining balance INR ${bookingDetails.remainingAmount} must be paid two days before the journey starts to retain the reservation.</strong> </p>`;
    }
    // Email details
    const mailOptions = {
        from: `"Sahyadri Vacations" ${process.env.HOSTINGER_EMAIL_USERNAME}`,
        to: recipientEmail,
        cc: 'sahyadrivacations21@gmail.com',
        subject: `Booking Confirmation - ${bookingDetails.eventName} (booking Id ${bookingDetails.bookingId})`,
        html: `
            <p>Hello <strong>${bookingDetails.name}</strong>,</p>
            <p>Greetings from <strong>Sahyadri Vacations and Adventures</strong>!</p>
            <p>We’re excited to confirm your booking for <strong>${bookingDetails.eventName} on ${bookingDetails.batch} </strong>.</p>
            <p><strong>Your payment of INR ${bookingDetails.amountPaid} has been successfully received.</strong>
            <br><br>Please find your invoice attached to this email for your referance.</p> 
            <p>For any assistance or further queries, feel free to reach out to us at 7028740961</p>
            <p>We look forward to hosting you on an exciting and memorable adventure! 🤩!</p>
            ${remainingAmountMessage}<br><br>
            ${signature}`,
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
