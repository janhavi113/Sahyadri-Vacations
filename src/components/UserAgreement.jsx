import React from 'react'
import Footer from "./footer";
import "./CreateEvents.css"
import "./UserAgreement.css"
import Navbar from "./Navbar";
const UserAgreement = () => {
    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="title-header"> Refund Policy & Cancellation Policy<br />
                </div>
                Please Read Carefully the Cancellation and Refund Rules – for Domestic and National Tours / Treks / Camping / Events by Sahyadri vacations and Adventures
                <div className="booking-caveats"><h3><strong>Cancellation Policy and Charges</strong></h3>

                    <ul className='display-bulletin add-margin'>
                        <li>75% refund if notified via phone conversation 8 or more days prior to the event date.</li>
                        <li>50 % refund if notified via phone conversation 4 to 7 days prior to the event date.</li>
                        <li>No refund if the cancellation requested is less than 3 days prior to the event date&nbsp;</li>
                        <li>No show No Refund.</li>
                        <li>Event Tickets cannot be transferred to another date against cancellation.</li>
                        <li>Event Tickets cannot be transferred to another person against cancellation.</li>
                        <li>If the event gets canceled we will refund "Trek Amount" only.</li>
                        <li>If the event is canceled due to any natural calamity, political unrest or other such reasons beyond our control the same cancellation policy will apply.</li>
                        <li>Refunds won't be issued if you cannot attend the event due to heavy rains, floods, traffic jams, car breakdowns or a personal medical emergency.</li>
                        <li>Your booking cannot be shifted to another date if you cannot attend the event due to heavy rains, floods, traffic jams, car breakdowns, or a personal medical emergency.</li>
                        <li>If your area is prone to flooding, traveling from a flooded area, heavy traffic, heavy rains, missing the train, or any other reason, if you cannot attend the event, we won't issue a refund or shift you to another date.</li>
                        <li>Management won't be held responsible if you are stuck due to heavy rains, traffic jams, personal emergencies or floods during the event.</li>
                        <li>If you are bringing kids, please understand the possibility of getting stuck or delayed. You might have to stay back due to heavy rains, floods, bus breakdowns, and rush at the trekking destination. We won't be able to refund or shift you to another date. You will have to wait it out till the weather clears.</li>
                        <li>Due to bad weather, floods, sudden changes in government rules, and overcrowding at the destination trek, the organizer has the right to change the trekking destination.</li>
                        <li>During the trek , due to any circumstances seen or unseen trek leader has the right to cancel the trek for safety reason. No refund shall be issued.</li>
                    </ul></div>
            </div>
            <Footer />
        </div>
    )
}

export default UserAgreement
