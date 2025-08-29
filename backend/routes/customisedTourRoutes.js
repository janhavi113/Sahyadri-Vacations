// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import {
    CustomisedRequest
} from '../models/CustomisedRequest.js';
import { sendEmail } from '../utils/api.js';
const router = express.Router();
// Customised Tour
router.post("/customised-tour", async (req, res) => {
    console.log('customised-tour', req.body);
    try {
        const {
            name,
            phone,
            traveldate,
            durationoftour,
            numberofpeople,
            email,
            message,
            preferedlocation,
        } = req.body;

        const customisedRequest = new CustomisedRequest({
            name: name,
            phone: phone,
            traveldate: traveldate,
            durationoftour: durationoftour,
            numberofpeople: numberofpeople,
            email: email,
            message: message,
            preferedlocation: preferedlocation,
        });

        customisedRequest.save();
        res.send({
            isSuccess: true
        });
        const subjectEmail = 'Received Your Custom Event Inquiry';
        const emailBody = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Custom Event Inquiry Acknowledgment</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                }
                h2 {
                    color: #4CAF50;
                }
                p {
                    font-size: 16px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777;
                    margin-top: 20px;
                }
                .email-footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>We’ve Received Your Custom Event Inquiry</h2>
                <p>Dear  ${name},</p>
                <p>Thank you for providing the details of your custom event inquiry! We are pleased to inform you that we have received your requirements and are currently reviewing them.</p>
                <p>Our team will reach out to you shortly to discuss the next steps and provide you with a tailored proposal that best matches your needs. We are excited to work with you and create a memorable experience.</p>
                <p>If you have any questions or additional details to share in the meantime, please feel free to contact us.</p>
                <p>Thank you once again for choosing Sahyadri Vacations & Adventure. We’ll be in touch soon!</p>
                <div class="email-footer">
                    <p>Warm regards,<br>
                    <p><strong>Sahyadri Vacations & Adventure</strong></p>
                    <p>Phone: 7028740961 </p>
                    <p>Email: <a href="mailto:contactus@sahyadrivacations.com">contactus@sahyadrivacations.com</a></p>
                    <p><a href="https://sahyadrivacations.com" target="_blank">https://sahyadrivacations.com</a></p>
                    <p>Follow us on:
                        <a href="https://m.facebook.com/people/Sahyadri-Vacations/100085021143109/" target="_blank">Facebook</a> |
                        <a href="https://www.youtube.com/channel/UCLY1fnNaABNhYilv4s1ehLQ" target="_blank">Youtube</a> |
                        <a href="https://www.instagram.com/sahyadri_vacations/" target="_blank">Instagram</a>
                    </p>
                    <p>© 2024 Sahyadri Vacations & Adventure. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        await sendEmail(email, emailBody, subjectEmail);
        const adminSubjectEmail = 'Received Your Custom Event Inquiry on ' + new Date(traveldate).toDateString() + ' for Duration of Tour';
        const adminEmailBody = ` <h3>New Custom Event Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Travel Date:</strong> ${new Date(traveldate).toDateString()}</p>
                <p><strong>Duration of Tour:</strong> ${durationoftour}</p>
                <p><strong>Number of People:</strong> ${numberofpeople}</p>
                <p><strong>Preferred Location:</strong> ${preferedlocation}</p>
                <p><strong>Message:</strong> ${message}</p>`;

        await sendEmail(process.env.HOSTINGER_EMAIL_USERNAME, adminEmailBody, adminSubjectEmail);


    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});
router.post("/contact-us", async (req, res) => {
    console.log('customised-tour', req.body);
    try {
        const {
            name,
            company,
            phone,
            budgetPerPerson,
            traveldate,
            numberofpeople,
            email,
            preferedLocation,
            message
        } = req.body;

        const customisedRequest = new CustomisedRequest({
            name: name,
            company: company,
            phone: phone,
            budgetPerPerson: budgetPerPerson,
            traveldate: traveldate,
            numberofpeople: numberofpeople,
            email: email,
            preferedLocation: preferedLocation,
            message: message,
        });

        customisedRequest.save();
        res.send({
            isSuccess: true
        });

        const subjectEmail = 'Thank You for Contacting Sahyadri Vacations & Adventure ';
        const emailBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Sahyadri Vacations & Adventure</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
        }
        h2 {
            color: #4CAF50;
        }
        p {
            font-size: 16px;
        }
        .email-footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
        .email-footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Thank You for Reaching Out to Us!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting Sahyadri Vacations & Adventure! We truly appreciate your interest in our services. Your inquiry has been received, and our team is currently reviewing it.</p>
        <p>One of our team members will be in touch with you shortly to discuss your request in detail and help you with the next steps.</p>
        <p>If you have any questions in the meantime or need further assistance, please feel free to reach out.</p>
        <p>We look forward to working with you!</p>
       
        <div class="email-footer">
        <p>Best regards,<br>
            <p><strong>Sahyadri Vacations & Adventure</strong></p>
            <p>Phone: 7028740961 </p>
            <p>Email: <a href="mailto:contactus@sahyadrivacations.com">contactus@sahyadrivacations.com</a></p>
            <p><a href="https://sahyadrivacations.com" target="_blank">https://sahyadrivacations.com</a></p>
            <p>Follow us on:
                <a href="https://m.facebook.com/people/Sahyadri-Vacations/100085021143109/" target="_blank">Facebook</a> |
                <a href="https://www.youtube.com/channel/UCLY1fnNaABNhYilv4s1ehLQ" target="_blank">Youtube</a> |
                <a href="https://www.instagram.com/sahyadri_vacations/" target="_blank">Instagram</a>
            </p>
            <p>© 2024 Sahyadri Vacations & Adventure. All rights reserved.</p>
        </div>
        
    </div>
</body>
</html>
`;

        await sendEmail(email, emailBody, subjectEmail);

        const adminSubjectEmail = `${name} contact from website`;
        const adminEmailBody = ` <h3>New Custom Event Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>`;

        await sendEmail(process.env.HOSTINGER_EMAIL_USERNAME, adminEmailBody, adminSubjectEmail);
    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});
export default router;
