import React, { useState } from 'react';
import './ShowEventDetails.css'
import faq from '../../Images/faq.svg'
import termsandcondition from '../../Images/terms-and-condition.svg'
import cancellation from '../../Images/cancellation.svg'
import TTC from '../../Images/things-to-carry.svg'
import open from '../../Images/opencollaps.svg'
import close from '../../Images/collaps.svg'
const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='collapsible-section'>
    <div className='collapsible-section-header' onClick={toggleSection}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {title === 'FAQ\'s' && <img className="collapsible-img" src={faq} alt="FAQ icon" crossOrigin="anonymous" />}
    {title === 'CANCELLATION POLICY' && <img className="collapsible-img" src={cancellation} alt="Cancellation icon" crossOrigin="anonymous" />}
    {title === 'TERMS AND CONDITIONS' && <img className="collapsible-img" src={termsandcondition} alt="Terms icon" crossOrigin="anonymous" />}
    {title === 'THINGS TO CARRY' && <img className="collapsible-img" src={TTC} alt="Things to carry icon" crossOrigin="anonymous" />}
    <h3 className="h3-collaps">{title}</h3>
  </div>
  <div>
    {isOpen ? (
      <img className="collapsible-img" src={open} alt="Open icon" crossOrigin="anonymous" />
    ) : (
      <img className="collapsible-img" src={close} alt="Close icon" crossOrigin="anonymous" />
    )}
  </div>
</div>

      {isOpen && (
        <div className="section-details-collaps">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
