import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Function to convert an image to Base64
const getImageAsBase64 = (filePath) => {
    const imageBuffer = fs.readFileSync(path.resolve(filePath));
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
};

export const generateInvoicePdf = async (bookingDetails, pdfPath) => {
    // Derive the current directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Construct the path to the logo
    const logo = getImageAsBase64(path.join(__dirname, '../../public/logo.png')); // Adjusted path to logo
    const finalPrice = bookingDetails.amountPaid * bookingDetails.numberOfPeoples;

    console.log('Booking Details:', bookingDetails);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body, html {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .invoice {
            padding: 20mm; /* Increased padding for better layout */
            border: 1px solid #ddd;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.05;
            width: 80%;
            height: auto;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .invoice-header h1 {
            font-size: 28px;
            margin: 0;
            color: #333;
        }
        .logo {
            width: 80px; /* Adjust logo size */
        }
        .customer-info, .invoice-info {
            width: 50%;
            font-size: 14px;
            line-height: 1.6;
            vertical-align: top;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .invoice-table th, .invoice-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
            text-align: left;
        }
        .total-label, .total-amount {
            font-weight: bold;
            font-size: 20px;
            text-align: right;
        }
        .company-info {
            font-size: 12px;
            margin-top: 50px; /* Adjusted space before company info */
        }
        .footer-strip {
            background-color: #00506b;
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        .horizontal-line {
            border: none;
            border-top: 1px solid #333;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <img src="${logo}" alt="Company Logo" class="watermark">
        <header class="invoice-header">
            <img src="${logo}" alt="Company Logo" class="logo">
            <h1>Invoice</h1>
        </header>
        <section class="invoice-details">
            <table style="width: 100%;">
                <tr>
                    <td class="customer-info">
                        <h3>Billed To:</h3>
                        <p>Name: ${bookingDetails.name}</p>
                        <p>Phone No: ${bookingDetails.mobileNumber}</p>
                        <p>Email: ${bookingDetails.email}</p>
                    </td>
                    <td class="invoice-info">
                        <h3>Invoice Details:</h3>
                        <p>Invoice Number: #${bookingDetails.bookingId}</p>
                        <p>Date: ${bookingDetails.bookingDate}</p>
                    </td>
                </tr>
            </table>
        </section>
        <hr class="horizontal-line">
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>No. of Bookings</th>
                    <th>Rate</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${bookingDetails.eventName}</td>
                    <td>${bookingDetails.numberOfPeoples}</td>
                    <td>${bookingDetails.eventPrice}</td>
                    <td>${finalPrice}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="total-label">Total</td>
                    <td class="total-amount">${finalPrice}</td>
                </tr>
            </tfoot>
        </table>
        <div class="company-info">
            <h2>Sahyadri Vacations And Adventure</h2>
            <p>Reg.No: MH-26-0256367</p>
            <p>1, Opp. to Komal sweets, Gulab Nagar Chowk, Dhankawdi, Pune -43</p>
            <p>Phone: 7028740961</p>
        </div>
    </div>
    <div class="footer-strip">
        <p>www.sahyadrivacations.com | sahyadrivacation21@gmail.com</p>
    </div>
</body>
</html>`;

    // Launch Puppeteer
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, // Set to false if you want to see the browser action
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Use these flags in CI environments
            dumpio: true, // Enable logging
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' }); // Load the HTML content

        // Generate PDF
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });

        console.log(`PDF saved at ${pdfPath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
