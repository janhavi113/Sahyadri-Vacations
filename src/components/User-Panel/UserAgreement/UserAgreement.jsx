import React from 'react'
import Footer from "../../footer";
import "../../admin-panel/CreateEvent/CreateEvents.css"
import "./UserAgreement.css"
import Navbar from "../../Navbar";
const UserAgreement = () => {
    return (
        <div>
            <Navbar />
            <div className="user-agreement-header">
            </div>
            <section className="terms_content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="terms-head">
                                <h4>TERMS AND CONDITIONS</h4>
                            </div>

                            <div className="policy-list terms-list">
                                <ul>
                                    <li>Please confirm seats availability on call before paying any amount.</li>
                                    <li>Once the payment is completed, inform our team via sharing a screenshot/copy of the payment confirmation. Make sure the date, time, and UTR number are visible in the copy and please fill the registration form to confirm your seats, names & age with the team.</li>
                                    <li>You will have to pay full amount of that event before departure, without it your booking will not be confirmed.</li>
                                    <li>Please note that the advance amount paid would not not refunded in any case, except if the trek/tour departure is cancelled by our side. Do check cancellation policy in case any refunds or cancellations.</li>
                                    <li>Please make sure you are added in the WhatsApp group 6-8 hours prior to the trip as all the pickup & lead details would be shared in the group.</li>
                                    <li>Food and Stay arrangements are done as per the availability of the locations so kindly don't expect too luxurious.</li>
                                    <li>Backpacking trips are arranged for the people who are looking out for pocket friendly trips and are more about chasing experiences.</li>
                                    <li>We need at least 12-14 Travellers to manage our Trip/Trek, So our team reserves all the rights to cancel the Trip if the minimum batch size is not enough.</li>
                                    <li>Everyone needs to fill our Waiver/Consent form at the time of departure, without it one cannot join to the event</li>
                                    <li>Your payment implies that you have read & complied with all our terms and conditions.</li>
                                </ul>
                            </div>

                          
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default UserAgreement
