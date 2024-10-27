import React from 'react'
import Footer from "../../footer";
import "../../admin-panel/CreateEvent/CreateEvents.css"
import "./UserAgreement.css"
import Navbar from "../../Navbar";
const PrivacyPolicy = () => {
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
                                <h4>Privacy Policy</h4>
                            </div>
                            <div className="terms-list"> 
                            <p>Thank you for choosing to be part of our community at Sahyadri Vacations and Adventure. We are dedicated to bringing people closer to nature through our travel and adventure services. With all the safety equipment and the right guidance, we aim to make every adventure possible for everyone, regardless of age. Conservation and appreciation of nature are very important to us, and we pledge to preserve our hiking trails, tourist sites, and natural heritage.</p>
                            <p>We are always happy to accept suggestions to improve our services and experiences.</p>

                            <h3>Your Privacy Matters</h3>
                            <p>Sahyadri Vacations and Adventure is committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regards to your personal information, please contact us at <a href="mailto:info@sahyadrivacations.com">info@sahyadrivacations.com</a>.</p>
                            <p>When you visit our website <a href="http://www.sahyadrivacations.com">www.sahyadrivacations.com</a> (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. This privacy notice seeks to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it. We hope you take some time to read it carefully as it is crucial for maintaining your trust and confidence in us.</p>

                            <h3>Collection of Personal Information</h3>
                            <p>We may collect the following information:</p>
                            <ul>
                                <li>Name</li>
                                <li>Contact information including email address</li>
                                <li>Demographic information such as postal code, preferences, and interests</li>
                                <li>Other information relevant to customer surveys and/or offers</li>
                            </ul>

                            <h3>Usage of Personal Information</h3>
                            <h4>Relevant Services to the Relevant Customer:</h4>
                            <p>We analyze customer trends and interests to bring the most relevant treks, tours, and other services to you according to your preferences. This analysis helps us provide personalized services. We may use and store information in an aggregated and anonymized form to ensure it is not associated with any individual end-user and does not include personal information. We will not use identifiable personal information without your consent.</p>

                            <h3>How Do We Keep Your Information Safe?</h3>
                            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. Therefore, we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, the transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.</p>
                            <p><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</p>
                            
                            <h3>Contact Us</h3>
                            <p>If you have any questions or concerns about this privacy notice or our practices with regards to your personal information, please contact us at <a href="mailto:info@sahyadrivacations.com">info@sahyadrivacations.com</a>.</p>
                            </div>
                            <div className="policy-list terms-list">
                                <h4>Collection of Personal Information</h4>
                                <p> We may collect the following information: </p>
                                <ul>
                                    <li>Name
                                    </li>
                                    <li>Contact information including email address</li>
                                    <li>Demographic information such as postal code, preferences, and interests</li>
                                    <li>Other information relevant to customer surveys and/or offers</li>
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

export default PrivacyPolicy
