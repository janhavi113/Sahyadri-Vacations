import React from 'react'
import Footer from "../../footer";
import "../../admin-panel/CreateEvent/CreateEvents.css"
import "./UserAgreement.css"
import Navbar from "../../Navbar";
const CancellationPolicy = () => {
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
                                <h4>Cancellation Policy</h4>
                            </div>

                            <div className="policy-list terms-list">
                                <h3>Events (1 or 2 days)</h3>
                                <ul>
                                    <li>75% refund if notified via phone conversation 8 or more days prior to the event date.
                                    </li>
                                    <li>50 % refund if notified via phone conversation 4 to 7 days prior to the event date.</li>
                                    <li>No refund if the cancellation requested is less than 3 days prior to the event date</li>
                                    <li>No show No Refund.</li>
                                    <li>Event Tickets cannot be transferred to another date against cancellation.</li>
                                    <li>Event Tickets cannot be transferred to another person against cancellation.</li>
                                    <li>If Trek gets canceled, we will refund the "Trek Amount" only.</li>

                                </ul>
                            </div>

                            <div className="policy-list terms-list">
                                <h3>Events (3-4 Days)</h3>
                                <ul>
                                    <li>If cancellation is done prior to 45 days of the outing 75% will be refunded.</li>
                                    <li>If done prior to 30 days of the outing 50% will be refunded</li>
                                    <li>If done prior to 15 days of outing 30% will be refunded</li>
                                    <li>After that, no refund will be provided</li>
                                    <li>No show No Refund</li>
                                    <li>Event Tickets cannot be transferred to another date against cancellation</li>
                                    <li>Event Tickets cannot be transferred to another person against cancellation</li>
                                    <li>If the Event gets cancelled, we will refund the "Event Amount" only</li>
                                </ul>
                            </div>


                            <div className="policy-list terms-list m-0">
                                <h3>Events (More than 4 Days)</h3>
                                <ul className="m-0">
                                    <li>If cancellation is done prior to 45 days of the outing 75% will be refunded.</li>
                                    <li>If done prior to 30 days of the outing 50% will be refunded</li>
                                    <li>If done prior to 15 days of outing 30% will be refunded</li>
                                    <li>After that, no refund will be provided</li>
                                    <li>No show No Refund</li>
                                    <li>Event Tickets cannot be transferred to another date against cancellation</li>
                                    <li>Event Tickets cannot be transferred to another person against cancellation</li>
                                    <li>If the Event get canceled, we will refund the "Event Amount" only</li>
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

export default CancellationPolicy
