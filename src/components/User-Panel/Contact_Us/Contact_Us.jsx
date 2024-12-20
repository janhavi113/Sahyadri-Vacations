import React, { useState } from 'react';
import './ContactForm.css';
import { faLocationDot, faEnvelope, faPhone ,faPhoneVolume} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sadface from '../../Images/sad-face.svg'
const Contact_Us = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
  const [isSubmitting, setSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    // Add your logic for form submission here
    console.log(formData);
    let r = await fetch(`${apiUrl}contact-us`,{
      method: "POST", headers: {
          "Content-Type": "application/json",
      }, body: JSON.stringify(formData)
  })
  let res = await r.json()
  console.log('res', JSON.stringify(res));
  if (res.isSuccess == true) {
      setSuccess(true);
  }else{
      setSuccess(false);
  }
  };
  const [isSuccess, setSuccess] = useState('');
  return (
    <div>
   
      <div className='contact-us-container'>
        <div className="container-top container">
          <div className="user-details">
          {!isSubmitting && <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="button-edit-container">
                <div className="contact-button button">
                  <input disabled={isSubmitting} type="submit" value="Submit" />
                </div>
              </div>
            </form>}
            {isSubmitting && isSuccess &&
                <div className="container">
                    <h2 className='thicker'> Thank you ! </h2>
                    <p className='customised-message '> Your interest is greatly appreciated, and we're thrilled to assist you in planning your ideal travel experience. Our dedicated team will be in touch with you very soon to discuss your preferences and craft a personalized itinerary that perfectly suits your needs. We can't wait to embark on this journey with you!</p>
                </div>
            }
            {isSubmitting && !isSuccess &&
                <div className="container">
                    <h2 className='thicker'> Try again ! </h2>
                    <div > <img style={{ margin: '12px 0px 0 46%' }} loading="lazy" src={sadface} /> </div>
                </div>
            }
          </div>
        </div>
        <div className="container-top container">
          <h2 className='thicker'> Find us here! </h2>
          <div className="user-details">
            <div className='address-show'>
              <FontAwesomeIcon className="location icon" icon={faLocationDot} size="1x" />
              <div className='address'>
                1, opp to Komal Sweets,
                Gulabnagar,
                Dhankawadi, Pune , Maharashtra - 411043
              </div>
            </div>
            <div className='address-show '>
              <a className='address' href="tel:07028740961">
                <FontAwesomeIcon className="icon" icon={faPhone} size="1x" />
                <span className='address'>
                  +91 7028740961  </span>
              </a>

            </div>

            <div className='address-show'>
              <a className='address address-email' href="mailto:contactus@sahyadrivacations.com">
                <FontAwesomeIcon className="icon" icon={faEnvelope} size="1x" />
                <span className='address'>
                  contactus@sahyadrivacations.com
                </span>
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact_Us
