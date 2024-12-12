import React from 'react'
import './SpecialOfferSection.css'
const SpecialOfferSection = ({ specialOffer }) => {
    console.log('----specialOffer', specialOffer);
    if (!specialOffer) {
        return <p>Loading special offer...</p>; // Render a fallback when offer is null
    }
    return (
        <section className="special-offer">
            <div className="hoverCard offer-image-container">
                <img src={specialOffer[0].imagePath} alt="" />
                <button className="offer-button">Explore More</button>
            </div>
        </section>
    )
}

export default SpecialOfferSection