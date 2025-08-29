import { useEffect, useState } from "react";
import BIGBUSK from '../../Images/CorporateClients/bigbucks.webp';
import TBWES from '../../Images/CorporateClients/Tbwes.jpg';
import JSPM from '../../Images/CorporateClients/JSPM.png';
import ENZIGMA from '../../Images/CorporateClients/enzigma.png';
import FITNESS from '../../Images/CorporateClients/FITNESS.png';
import INFINITY from '../../Images/CorporateClients/infinity.png';
import BEAST from '../../Images/CorporateClients/GOLD.png';
import MDI from '../../Images/CorporateClients/MDI.jpeg';
import './CorporateBooking.css'
const logos = [TBWES, BIGBUSK, JSPM, ENZIGMA, INFINITY, BEAST, FITNESS, MDI];

const TrustedBy = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Duplicate logos for infinite effect
  const loopedLogos = [...logos, ...logos];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Reset when we reach the end of the first set
  useEffect(() => {
    if (currentIndex === logos.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // remove animation for jump
        setCurrentIndex(0);        // jump back to start
      }, 700); // match your transition duration

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsTransitioning(true);
  };

  return (
    <section className="py-12 px-8 md:px-20 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Trusted by</h2>

      {/* Carousel Wrapper */}
      <div className="overflow-hidden max-w-5xl mx-auto">
        <div
          className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {loopedLogos.map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-1/3 flex justify-center items-center"
            >
              <img src={logo} alt={`Logo-${i}`} className="h-24 md:h-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Clickable Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {logos.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-2 w-2 rounded-full cursor-pointer border-0 p-0 
              ${i === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
            style={{ appearance: "none" }}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;