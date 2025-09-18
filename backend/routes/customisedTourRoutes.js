// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import {
    CustomisedRequest
} from '../models/CustomisedRequest.js';
import {
    Events
} from '../models/Event.js';
import { sendEmail } from '../utils/api.js';
const router = express.Router();

router.get("/show-all-custom-Inquiry/:showOptions", async (req, res) => {
    try {

        let query;
        console.log('req.params.showOptions--', req.params.showOptions);
        if (req.params.showOptions == 'all') {
            query = {};
        } else {
            query = { status: req.params.showOptions };
        }
        let customisedRequests = await CustomisedRequest.find(query);
        console.log('customisedRequests-- ', customisedRequests);
        res.send({
            customisedRequests: customisedRequests,
            isSuccess: true
        });

    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});

router.post("/update-custom-Inquiry/:Id", async (req, res) => {
    try {
        const updates = req.body;  // 👈 values to update
        const id = req.body._id;
        console.log('updates--', updates);

        const updatedDoc = await CustomisedRequest.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true } // return updated document
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Record not found" });
        }
        console.log('customisedRequests-- ', updatedDoc);
        res.send({
            customisedRequest: updatedDoc,
            isSuccess: true
        });

    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});
// DELETE custom inquiry by id
router.delete("/delete-custom-inquiry/:id", async (req, res) => {
    try {
        const deleted = await CustomisedRequest.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ isSuccess: false, message: "Inquiry not found" });
        }
        res.json({ isSuccess: true, message: "Inquiry deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccess: false, message: "Server error" });
    }
});

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
            preferredLocation,
        } = req.body;

        const customisedRequest = new CustomisedRequest({
            name: name,
            phone: phone,
            traveldate: traveldate,
            durationoftour: durationoftour,
            numberofpeople: numberofpeople,
            email: email,
            message: message,
            preferredLocation: preferredLocation,
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
                <p><strong>Preferred Location:</strong> ${preferredLocation}</p>
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
router.post("/update-customised-tour", async (req, res) => {
  console.log("customised-tour--", req.body);
  try {
    const {
      _id,                // 👈 get the id from request body
      name,
      company,
      phone,
      budgetPerPerson,
      traveldate,
      numberofpeople,
      email,
      preferredLocation,
      message,
      finalPackage,
      durationoftour,
    } = req.body;

    if (!_id) {
      return res.status(400).send({
        isSuccess: false,
        error: "Missing _id for update",
      });
    }

    const updatedDoc = await CustomisedRequest.findByIdAndUpdate(
      _id,
      {
        name,
        company,
        phone,
        budgetPerPerson,
        traveldate,
        numberofpeople,
        email,
        preferredLocation,
        message,
        finalPackage,
        durationoftour,
      },
      { new: true } // 👈 return the updated document
    );

    if (!updatedDoc) {
      return res.status(404).send({
        isSuccess: false,
        error: "Document not found",
      });
    }

    res.send({
      isSuccess: true,
      data: updatedDoc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      isSuccess: false,
      error: error.message,
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
            preferredLocation,
            message,
            finalPackage,       // 👈 added
            durationoftour,
        } = req.body;

        const customisedRequest = new CustomisedRequest({
            name: name,
            company: company,
            phone: phone,
            budgetPerPerson: budgetPerPerson,
            traveldate: traveldate,
            numberofpeople: numberofpeople,
            email: email,
            preferredLocation: preferredLocation,
            message: message,
            finalPackage: budgetPerPerson,       // 👈 added
            durationoftour: durationoftour,

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

router.post('/upsert-customitiniery/:id', async (req, res) => {
    try {
        const {
            eventName,
            apiname,
            eventDetails,
            itinerary,
            highlights,
            costIncludes,
            costExcludes,
            FAQ,
            thingsToCarry,
            pickupPoints,
            eventType,
            currentImages,
            location,
            type,
            elevation,
            difficulty,
            endurance,
            duration,
            totalDistance,
            ageGroup,
            trekDistance,
            pickupPointsfromMumbai,
            b2bLocaion,
        } = req.body;
        let requestId = req.params.id.replace(/^:/, ""); // remove leading colon if present

        let imageList = [];
        // Process existing images
        if (currentImages != undefined && !Array.isArray(currentImages)) {
            imageList.push(currentImages.toString().replace("blob:", ""));
        } else if (Array.isArray(currentImages)) {
            for (let img of currentImages) {
                imageList.push(img.toString().replace("blob:", ""));
            }
        }

        // Handle file upload, if files exist
        let sampleFile = req.files?.files;
        if (sampleFile) {
            if (!Array.isArray(sampleFile)) sampleFile = [sampleFile]; // Ensure array for consistency

            for (let file of sampleFile) {
                let uploadPath = path.join(__dirname, '../../public/Images', file.name);
                imageList.push('public/Images/' + file.name);
                await file.mv(uploadPath); // Await each move operation
            }
        }
        // Database operations
        var events = await Events.find().sort([["_id", -1]]).limit(1);
        var recordcount = events.length > 0 ? events[0].eventId : 0;
        let updateDoc = {
            name: eventName,
            apiname: apiname,
            itinerary: itinerary,
            eventDetails: eventDetails,
            eventType: eventType,
            costIncludes: costIncludes,
            costExcludes: costExcludes,
            FAQ: FAQ,
            thingsToCarry: thingsToCarry,
            pickupPoints: pickupPoints,
            highlights: highlights,
            images: imageList,
            location: location,
            type: type,
            elevation: elevation,
            difficulty: difficulty,
            endurance: endurance,
            duration: duration,
            totalDistance: totalDistance,
            ageGroup: ageGroup,
            trekDistance: trekDistance,
            b2bLocaion: b2bLocaion,
            pickupPointsfromMumbai: pickupPointsfromMumbai
        };

        // if inserting, assign new eventId + url
        const result = await Events.findOneAndUpdate(
            { apiname: req.body.apiname }, // match by apiname
            {
                $set: updateDoc,
                $setOnInsert: {
                    eventId: recordcount + 1,
                    url: "/create-event/event-details/" + (recordcount + 1)
                }
            },
            { new: true, upsert: true }
        );
        // update CustomisedRequest with this event id
         const customisedRequest = await CustomisedRequest.findByIdAndUpdate(
            requestId,
            {
                $set: {
                    eventId: result.eventId,
                    preferredLocation: result.name
                }
            }, // you can store either numeric id or ObjectId ref
            { new: true }
        );
        res.send({
            eventId: recordcount + 1,
            isSuccess: true,
            result,              // full event object
            customisedRequest   // updated request object
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            isSuccess: false,
            error: err.message
        });
    }
});

export default router;
