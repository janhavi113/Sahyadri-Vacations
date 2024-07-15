import React, { useEffect, useState } from 'react'
import Whatsapp from '../Images/whatsapp.svg';
import '../home.css'
const contactSection = () => {
    const [show, setShow] = useState(false);
    const showDropdown = () => {
        setShow(!show);
      }
  return (
    
    <div>
      <div className="Phone">
          <a className="btn" onClick={showDropdown} aria-expanded="false">
            <img loading="lazy" src={Whatsapp} />
          </a>
          {show &&
            <ul className="dropdown-menu show">
              <li>
                <a className="dropdown-item" href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank">
                  <i className="bi bi-whatsapp"></i>
                  WhatsApp
                </a>
              </li>
              <hr />
              <li>
                <a className="dropdown-item" href="tel:07028740961">
                  <i className="bi bi-telephone"></i>
                  Call Now
                </a>
              </li>
              <hr />
              <li>
                <a className="dropdown-item" href="mailto:sahyadrivacations21@gmail.com">
                  <i className="bi bi-telephone"></i>
                  Email
                </a>
              </li>
            </ul>}
        </div>
    </div>
  )
}

export default contactSection
